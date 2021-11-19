import type { Model } from 'backbone';
import Backbone from 'backbone';
import $ from 'jquery';
import React from 'react';
import type { State } from 'typesafe-reducer';

import DeleteButton from '../deletebutton';
import initialContext from '../initialcontext';
import commonText from '../localization/common';
import navigation from '../navigation';
import populateform from '../populateform';
import SaveButton from '../savebutton';
import schema from '../schema';
import specifyform from '../specifyform';
import userInfo from '../userinfo';
import { DateElement, TableIcon } from './common';
import { closeDialog, LoadingScreen, ModalDialog } from './modaldialog';
import createBackboneView from './reactbackboneextend';
import { useCachedState } from './stateCache';
import type { IR, RA } from './wbplanview';

const tablesToShowPromise: Promise<RA<string>> = new Promise<Document>(
  (resolve) => initialContext.loadResource('querybuilder.xml', resolve)
)
  .then((document) =>
    Array.from(
      document.querySelectorAll('database > table'),
      (table) => table.getAttribute('name')?.toLowerCase() ?? ''
    )
      .filter(
        (tableName) =>
          tableName &&
          (tableName !== 'spauditlog' || userInfo.usertype === 'Manager')
      )
      .sort()
  )
  .catch((error) => {
    console.error(error);
    return [];
  });

const compareValues = (
  ascending: boolean,
  valueLeft: string | undefined,
  valueRight: string | undefined
): number =>
  (valueLeft ?? '').localeCompare(valueRight ?? '') * (ascending ? -1 : 1);

export type SortConfig<FIELD_NAMES extends string> = {
  readonly sortField: FIELD_NAMES;
  readonly ascending: boolean;
};

function SortIndicator({
  fieldName,
  sortConfig,
}: {
  readonly fieldName: string;
  readonly sortConfig: SortConfig<string>;
}): JSX.Element {
  return (
    <span className="sort-indicator">
      {sortConfig.sortField === fieldName
        ? sortConfig.ascending
          ? '▲'
          : '▼'
        : undefined}
    </span>
  );
}

function QueryList({
  queries: unsortedQueries,
  onEdit: handleEdit,
  getQuerySelectUrl,
}: {
  readonly queries: RA<Query>;
  readonly onEdit?: (query: Query) => void;
  readonly getQuerySelectUrl?: (query: Query) => string;
}): JSX.Element | null {
  const [sortConfig, setSortConfig] = useCachedState({
    bucketName: 'sort-config',
    cacheName: 'listOfQueries',
    bucketType: 'localStorage',
    defaultValue: {
      sortField: 'dateCreated',
      ascending: false,
    },
  });

  // eslint-disable-next-line unicorn/no-null
  if (typeof sortConfig === 'undefined') return null;

  const queries = Array.from(unsortedQueries).sort(
    (
      { name: nameLeft, dateCreated: dateCreatedLeft },
      { name: nameRight, dateCreated: dateCreatedRight }
    ) =>
      sortConfig.sortField === 'name'
        ? compareValues(sortConfig.ascending, nameLeft, nameRight)
        : compareValues(sortConfig.ascending, dateCreatedLeft, dateCreatedRight)
  );

  return (
    <table className="grid-table list-of-queries">
      <thead>
        <tr>
          <th scope="col" className="pl-table-icon">
            <button
              type="button"
              className="fake-link list-of-queries-name"
              onClick={(): void =>
                setSortConfig({
                  sortField: 'name',
                  ascending: !sortConfig.ascending,
                })
              }
            >
              {commonText('name')}
              <SortIndicator fieldName="name" sortConfig={sortConfig} />
            </button>
          </th>
          <th scope="col">
            <button
              type="button"
              className="fake-link list-of-queries-date-created"
              onClick={(): void =>
                setSortConfig({
                  sortField: 'dateCreated',
                  ascending: !sortConfig.ascending,
                })
              }
            >
              {commonText('created')}
              <SortIndicator fieldName="dateCreated" sortConfig={sortConfig} />
            </button>
          </th>
          <td />
        </tr>
      </thead>
      <tbody>
        {queries.map((query) => (
          <tr key={query.id}>
            <td>
              <a
                href={
                  getQuerySelectUrl?.(query) ?? `/specify/query/${query.id}/`
                }
                className="fake-link"
                style={{ overflowX: 'auto' }}
              >
                <TableIcon tableName={query.tableName} tableLabel={false} />
                {query.name}
              </a>
            </td>
            <td style={{ color: 'var(--t3)' }}>
              <DateElement date={query.dateCreated} />
            </td>
            <td className="justify-end">
              {typeof handleEdit === 'function' && (
                <button
                  type="button"
                  className="fake-link ui-icon ui-icon-pencil"
                  onClick={(): void => handleEdit(query)}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ListOfTables({
  tables,
  getQueryCreateUrl,
}: {
  readonly tables: RA<string>;
  readonly getQueryCreateUrl: (tableName: string) => string;
}): JSX.Element {
  return (
    <ul className="list-of-tables" style={{padding: 0}}>
      {tables.map((tableName, index) => (
        <li key={index}>
          <a href={getQueryCreateUrl(tableName)} className="fake-link">
            <TableIcon tableName={tableName} tableLabel={false} />
            {schema.getModel(tableName).getLocalizedName()}
          </a>
        </li>
      ))}
    </ul>
  );
}

export type Query = {
  readonly id: number;
  readonly name: string;
  readonly tableName: string;
  readonly dateCreated: string | undefined;
};

type ShowQueryListState = State<'ShowQueryListState'>;
type CreateQueryState = State<'CreateQueryState'>;
type States = ShowQueryListState | CreateQueryState;

const QUERY_FETCH_LIMIT = 5000;

type Props = {
  onClose: () => void;
  getQueryCreateUrl?: (tableName: string) => string;
  getQuerySelectUrl?: (query: Query) => string;
  onEdit?: (query: Query) => void;
  spQueryFilter?: IR<unknown>;
  buttons?: (state: States) => RA<JQueryUI.DialogButtonOptions>;
};
type ComponentProps = Readonly<Props>;

function QueryToolbarItem({
  onClose: handleClose,
  getQueryCreateUrl,
  getQuerySelectUrl,
  onEdit: handleEdit,
  spQueryFilter,
  buttons,
}: ComponentProps): JSX.Element {
  const [tablesToShow] = useCachedState({
    bucketName: 'common',
    cacheName: 'listOfQueryTables',
    bucketType: 'sessionStorage',
    defaultValue: async () => tablesToShowPromise,
  });

  const [queries, setQueries] = React.useState<RA<Query> | undefined>(
    undefined
  );

  const [state, setState] = React.useState<States>({
    type: 'ShowQueryListState',
  });

  React.useEffect(() => {
    let destructorCalled = false;
    const queryModels = new (schema as any).models.SpQuery.LazyCollection({
      filters: spQueryFilter ?? { specifyuser: userInfo.id },
    });
    queryModels.fetch({ limit: QUERY_FETCH_LIMIT }).done(() =>
      destructorCalled
        ? undefined
        : setQueries(
            (queryModels.models as RA<Model>).map((query) => ({
              id: query.get('id'),
              name: query.get('name'),
              tableName: schema
                .getModelById(query.get('contexttableid'))
                .name.toLowerCase(),
              dateCreated: query.get('timestampcreated'),
            }))
          )
    );
    return (): void => {
      destructorCalled = true;
    };
  }, [spQueryFilter]);

  if (state.type === 'ShowQueryListState') {
    return typeof queries === 'undefined' ? (
      <LoadingScreen />
    ) : (
      <ModalDialog
        properties={{
          close: handleClose,
          modal: true,
          maxHeight: 500,
          width: 400,
          title: commonText('queriesDialogTitle')(queries.length),
          buttons: [
            ...(buttons?.(state) ?? []),
            ...(typeof getQueryCreateUrl === 'undefined'
              ? []
              : [
                  {
                    text: commonText('new'),
                    click: (): void =>
                      setState({
                        type: 'CreateQueryState',
                      }),
                  },
                ]),
            {
              text: commonText('cancel'),
              click: closeDialog,
            },
          ],
        }}
      >
        <QueryList
          queries={queries}
          onEdit={handleEdit}
          getQuerySelectUrl={getQuerySelectUrl}
        />
      </ModalDialog>
    );
  } else if (
    state.type === 'CreateQueryState' &&
    typeof getQueryCreateUrl !== 'undefined'
  )
    return typeof tablesToShow === 'undefined' ? (
      <LoadingScreen />
    ) : (
      <ModalDialog
        properties={{
          close: handleClose,
          modal: true,
          maxHeight: 500,
          width: 300,
          title: commonText('newQueryDialogTitle'),
          buttons: [
            ...(buttons?.(state) ?? []),
            {
              text: commonText('cancel'),
              click: (): void => setState({ type: 'ShowQueryListState' }),
            },
          ],
        }}
      >
        <ListOfTables
          tables={tablesToShow}
          getQueryCreateUrl={getQueryCreateUrl}
        />
      </ModalDialog>
    );
  else throw new Error('Invalid ToolbarQuery State type');
}

export const QueryToolbarView = createBackboneView<
  Props,
  Props,
  ComponentProps
>({
  moduleName: 'QueryToolbarItem',
  className: 'query-toolbar-item',
  Component: QueryToolbarItem,
  initialize(
    self,
    {
      onClose,
      getQueryCreateUrl = undefined,
      getQuerySelectUrl,
      onEdit = undefined,
      spQueryFilter = undefined,
      buttons = undefined,
    }
  ) {
    self.onClose = onClose;
    self.getQueryCreateUrl = getQueryCreateUrl;
    self.getQuerySelectUrl = getQuerySelectUrl;
    self.onEdit = onEdit;
    self.spQueryFilter = spQueryFilter;
    self.buttons = buttons;
  },
  getComponentProps: (self) => ({
    onClose: self.onClose,
    getQueryCreateUrl: self.getQueryCreateUrl,
    getQuerySelectUrl: self.getQuerySelectUrl,
    onEdit: self.onEdit,
    spQueryFilter: self.spQueryFilter,
    buttons: self.buttons,
  }),
});

export default {
  task: 'query',
  title: commonText('queries'),
  icon: '/static/img/query.png',
  execute(): void {
    const element = document.createElement('div');
    // @ts-expect-error
    const view = new QueryToolbarView({
      el: element,
      onClose: () => view.remove(),
      getQueryCreateUrl: userInfo.isReadOnly
        ? undefined
        : (tableName: string): string => `/specify/query/new/${tableName}/`,
      getQuerySelectUrl: undefined,
      onEdit: userInfo.isReadOnly
        ? undefined
        : (query: Query): void => {
            view.remove();
            const queryModel = new (
              schema as any
            ).models.SpQuery.LazyCollection({
              filters: { id: query.id },
            });
            queryModel.fetch({ limit: 1 }).then(() => {
              const dialog = new EditQueryDialog({
                spquery: queryModel.models[0],
              });
              $('body').append(dialog.el);
              dialog.render();
            });
          },
    });
    document.body.append(element);
    view.render();
  },
};

const EditQueryDialog = Backbone.View.extend({
  __name__: 'EditQueryDialog',
  className: 'query-edit-dialog',
  events: {
    'click .query-export': 'exportQuery',
    'click .create-report, .create-label': 'createReport',
  },
  initialize(options: { readonly spquery: Model }) {
    this.spquery = options.spquery;
    this.model = schema.getModelById(this.spquery.get('contexttableid'));
  },
  render() {
    specifyform.buildViewByName('Query').done(this._render.bind(this));
    return this;
  },
  _render(form: JQuery) {
    form.find('.specify-form-header:first').remove();

    if (!this.spquery.isNew()) {
      form.append(`
        <ul style="padding: 0">
           <li style="display:flex;margin:5px">
               <span class="ui-icon ui-icon-circle-plus"/>
               <button type="button" class="query-export fake-link">${commonText(
                 'exportQueryForDwca'
               )}</button>
           </li>
           <li style="display:flex;margin:5px">
               <span class="ui-icon ui-icon-circle-plus"/>
               <button type="button" class="create-report fake-link">${commonText(
                 'exportQueryAsReport'
               )}</button>
           </li>
           <li style="display:flex;margin:5px">
               <span class="ui-icon ui-icon-circle-plus"/>
               <button type="button" class="create-label fake-link">${commonText(
                 'exportQueryAsLabel'
               )}</button>
           </li>
        </ul>
      `);
    }

    const buttons = $('<div class="specify-form-buttons">').appendTo(form);

    if (!this.readOnly) {
      const saveButton = new SaveButton({ model: this.spquery });
      saveButton.render().$el.appendTo(buttons);
      saveButton.bindToForm(form[0].querySelector('form'));
      saveButton.on(
        'savecomplete',
        () => {
          this.remove();
          navigation.go(`/query/${this.spquery.id}/`);
        },
        this
      );
    }

    const label = this.spquery.specifyModel.getLocalizedName();
    const title = this.spquery.isNew()
      ? commonText('newResourceTitle')(label)
      : label;

    if (!this.spquery.isNew() && !this.readOnly) {
      const deleteButton = new DeleteButton({ model: this.spquery });
      deleteButton.render().$el.appendTo(buttons);
      deleteButton.on('deleted', () => this.remove());
    }

    populateform(form, this.spquery);

    this.$el.append(form).dialog({
      modal: true,
      width: 'auto',
      title,
      close: () => this.remove(),
    });
  },
  remove() {
    this.$el.remove();
  },
  createReport(event_: MouseEvent) {
    const isLabel = (event_.currentTarget as HTMLElement).classList.contains(
      'create-label'
    );
    const nameInput = $(`<input
                type="text"
                placeholder="${
                  isLabel ? commonText('labelName') : commonText('reportName')
                }"
                size="40"
            >`);

    const createReport = () =>
      $.post('/report_runner/create/', {
        queryid: this.spquery.id,
        mimetype: isLabel ? 'jrxml/label' : 'jrxml/report',
        name: nameInput.val(),
      })
        .then((reportJSON) => {
          const report = new (schema as any).models.SpReport.Resource(
            reportJSON
          );
          return report.rget('appresource');
        })
        .done((appresource) =>
          navigation.go(`/specify/appresources/${appresource.id}/`)
        );

    $(`<div>
                ${
                  isLabel
                    ? commonText('createLabelDialogHeader')
                    : commonText('createReportDialogHeader')
                }
            </div>`)
      .append(nameInput)
      .dialog({
        modal: true,
        width: 'auto',
        title: isLabel
          ? commonText('createLabelDialogTitle')
          : commonText('createReportDialogTitle'),
        close() {
          $(this).remove();
        },
        buttons: {
          [commonText('create')]() {
            // @ts-expect-error
            if (!nameInput.val()?.trim()) return;
            $(this).dialog('close');
            createReport();
          },
          [commonText('cancel')]() {
            $(this).dialog('close');
          },
        },
      });
  },
  exportQuery() {
    $.get({
      url: `/export/extract_query/${this.spquery.id}/`,
      dataType: 'text',
    }).done((xml) => {
      const dialog = $(`<div>
                    ${commonText('exportQueryForDwcaDialogHeader')}
                    <textarea cols="120" rows="40" readonly></textarea>
                </div>`);
      $('textarea', dialog).text(xml);
      dialog.dialog({
        modal: true,
        width: 'auto',
        title: commonText('exportQueryForDwcaDialogTitle'),
        close() {
          $(this).remove();
        },
        buttons: {
          [commonText('close')]() {
            $(this).dialog('close');
          },
        },
      });
    });
  },
});
