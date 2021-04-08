import React from 'react';
import { namedComponent } from '../statemanagement';
import { getMappingLineData } from '../wbplanviewnavigator';
import { MappingsTree } from '../wbplanviewtreehelper';
import { MappingPathComponent } from './wbplanviewcomponents';
import { MappingPath } from './wbplanviewmapper';

export type GetMappedFieldsBind = (
  // a mapping path that would be used as a filter
  mappingPathFilter: MappingPath,
) => MappingsTree;

export type PathIsMappedBind = (
  // a mapping path that would be used as a filter
  mappingPathFilter: MappingPath,
) => boolean;

export const MappingsControlPanel = React.memo(namedComponent(
  'MappingsControlPanel',
  ({
    showHiddenFields,
    readonly,
    handleChange,
    mappingIsTemplated,
    handleToggleMappingIsTemplated,
    // handleAddNewColumn,
    // handleAddNewStaticColumn,
  }: {
    readonly showHiddenFields: boolean,
    readonly readonly: boolean,
    readonly handleChange?: () => void,
    readonly handleAddNewColumn?: () => void,
    readonly handleAddNewStaticColumn?: () => void,
    readonly handleToggleMappingIsTemplated?: () => void,
    readonly mappingIsTemplated: boolean,
  }) =>
    <div>
      <label>
        <input
          type="checkbox"
          checked={mappingIsTemplated}
          onChange={handleToggleMappingIsTemplated}
          disabled={readonly}
        />
        Use this mapping as a template
      </label>
      {/*<button onClick={handleAddNewColumn}>Add new column</button>*/}
      {/*<button onClick={handleAddNewStaticColumn}>
        Add new static column
      </button>*/}
      <label>
        {' '}<input
        type="checkbox"
        checked={showHiddenFields}
        onChange={handleChange}
      />
        Reveal hidden fields
      </label>
    </div>),
);

export function FormatValidationResults(props: {
  readonly baseTableName: string,
  readonly validationResults: MappingPath[],
  readonly handleSave: () => void
  readonly getMappedFields: GetMappedFieldsBind,
  readonly onValidationResultClick: (mappingPath: MappingPath) => void,
}):JSX.Element|null {
  if (props.validationResults.length === 0)
    return null;

  return <div className="validation-results">
    <span>
      The following fields should be mapped before you can upload
      the dataset:
    </span>
    {props.validationResults.map((fieldPath, index) =>
      <div
        className="wbplanview-mapping-line-elements"
        key={index}
        onClick={props.onValidationResultClick.bind(null, fieldPath)}
      >
        <MappingPathComponent
          mappingLineData={getMappingLineData({
            baseTableName: props.baseTableName,
            mappingPath: fieldPath,
            generateLastRelationshipData: false,
            customSelectType: 'PREVIEW_LIST',
            getMappedFields: props.getMappedFields,
          })}
        />
      </div>,
    )}
    <span>
      Or you can <button
      onClick={props.handleSave}>Save Unfinished Mapping</button>
      and finish editing it later
    </span>
  </div>;
}

export function MappingView(props: {
  readonly baseTableName: string,
  readonly focusedLineExists: boolean,
  readonly mappingPath: MappingPath,
  readonly mapButtonIsEnabled: boolean,
  readonly readonly: boolean,
  readonly handleMapButtonClick?: () => void
  readonly handleMappingViewChange?: (
    index: number,
    newValue: string,
    isRelationship: boolean,
    currentTable: string,
    newTable: string,
  ) => void,
  readonly getMappedFields: GetMappedFieldsBind,
  readonly showHiddenFields?: boolean,
}):JSX.Element|null {

  const mappingLineData = getMappingLineData({
    baseTableName: props.baseTableName,
    mappingPath: props.mappingPath,
    generateLastRelationshipData: true,
    customSelectType: 'OPENED_LIST',
    handleChange: props.handleMappingViewChange,
    getMappedFields: props.getMappedFields,
    showHiddenFields: props.showHiddenFields,
  });
  const mapButtonIsEnabled =
    !props.readonly &&
    props.mapButtonIsEnabled && (
      Object.entries(
        mappingLineData[mappingLineData.length - 1]?.fieldsData,
      ).filter(([, {isDefault: isDefault}]) =>
        isDefault,
      )?.[0]?.[1].isEnabled ?? false
    );

  return <>
    <div className="mapping-view">
      <MappingPathComponent
        mappingLineData={mappingLineData}
      />
    </div>
    <button
      className="wbplanview-mapping-view-map-button"
      disabled={!mapButtonIsEnabled}
      onClick={
        mapButtonIsEnabled && props.focusedLineExists ?
          props.handleMapButtonClick :
          undefined
      }
    >
      Map
      <span
        className="wbplanview-mapping-view-map-button-arrow">&#8594;</span>
    </button>
  </>;
}

export const defaultMappingViewHeight = 300;
export const minMappingViewHeight = 250;