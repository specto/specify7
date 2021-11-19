/*
 *
 * Workbench plan mapper
 *
 *
 */

import '../../css/wbplanview.css';

import React from 'react';

import type { JqueryPromise } from '../legacytypes';
import type { UploadPlan } from '../uploadplantomappingstree';
import type { OpenMappingScreenAction } from '../wbplanviewreducer';
import { reducer } from '../wbplanviewreducer';
import type { RefActions, RefStates } from '../wbplanviewrefreducer';
import {
  refInitialState,
  refObjectDispatch,
  refStatesMapper,
} from '../wbplanviewrefreducer';
import type { UploadResult } from '../wbuploadedparser';
import { useId } from './common';
import { getInitialWbPlanViewState, stateReducer } from './wbplanviewstate';

// General definitions
export type Status = {
  readonly uploaderstatus: {
    readonly operation: 'validating' | 'uploading' | 'unuploading';
    readonly taskid: string;
  };
} & (
  | {
      readonly taskstatus: 'PENDING' | 'FAILURE';
      readonly taskinfo: 'None';
    }
  | {
      readonly taskstatus: 'PROGRESS';
      readonly taskinfo: {
        readonly total: number;
        readonly current: number;
      };
    }
);

export type DatasetBrief = {
  id: number;
  name: string;
  uploadresult: {
    success: boolean;
    timestamp: string;
    recordsetid: number;
  } | null;
  uploaderstatus: Status | null;
  timestampcreated: string;
  timestampmodified: string;
};

export type Dataset = DatasetBrief & {
  columns: RA<string>;
  createdbyagent: string;
  importedfilename: string;
  modifiedbyagent: string;
  remarks: string | null;
  rowresults: RA<UploadResult> | null;
  rows: RA<RA<string>>;
  uploadplan: UploadPlan | null;
  visualorder: null | RA<number>;
};

export interface SpecifyResource {
  readonly id: number;
  readonly get: (query: string) => SpecifyResource | any;
  readonly rget: (query: string) => JqueryPromise<SpecifyResource | any>;
  readonly set: (query: string, value: any) => void;
  readonly save: () => void;
}

// Record
export type R<V> = Record<string, V>;
// Immutable record
export type IR<V> = Readonly<Record<string, V>>;
// Immutable record of any type
export type RR<K extends string | number | symbol, V> = Readonly<Record<K, V>>;
// Immutable Array
export type RA<V> = readonly V[];

export interface WbPlanViewProps
  extends WbPlanViewWrapperProps,
    PublicWbPlanViewProps {
  readonly uploadPlan: UploadPlan | null;
  readonly headers: RA<string>;
  readonly setUnloadProtect: () => void;
  readonly readonly: boolean;
}

export type PartialWbPlanViewProps = {
  readonly removeUnloadProtect: () => void;
};

export type WbPlanViewWrapperProps = PartialWbPlanViewProps &
  PublicWbPlanViewProps & {
    readonly setUnloadProtect: () => void;
  };

export type PublicWbPlanViewProps = {
  dataset: Dataset;
};

export function WbPlanView(props: WbPlanViewProps): JSX.Element {
  const [state, dispatch] = React.useReducer(
    reducer,
    {
      uploadPlan: props.uploadPlan,
      headers: props.headers,
      changesMade: false,
    } as OpenMappingScreenAction,
    getInitialWbPlanViewState
  );

  /*
   * `refObject` is like `state`, but does not cause re-render on change
   * Useful for animations, transitions and triggering async actions
   * from inside of an action reducer
   */
  const refObject = React.useRef<RefStates>(refInitialState);
  const refObjectDispatchCurried = (action: RefActions): void =>
    refObjectDispatch({
      ...action,
      payload: {
        refObject,
        state,
        props,
        stateDispatch: dispatch,
      },
    });

  // Reset refObject on state change
  if (
    refObject.current.type !==
    // @ts-expect-error
    (refStatesMapper[state.type] ?? 'RefUndefinedState')
  )
    refObjectDispatchCurried({
      type: 'RefChangeStateAction',
    });

  // Set/unset unload protect
  React.useEffect(() => {
    const changesMade = 'changesMade' in state ? state.changesMade : false;

    if (
      state.type === 'LoadingState' ||
      refObject.current.type !== 'RefMappingState'
    )
      return;

    if (refObject.current.unloadProtectIsSet && !changesMade)
      refObjectDispatchCurried({
        type: 'RefUnsetUnloadProtectAction',
      });
    else if (!refObject.current.unloadProtectIsSet && changesMade)
      refObjectDispatchCurried({
        type: 'RefSetUnloadProtectAction',
      });
  }, ['changesMade' in state ? state.changesMade : false]);

  // Wait for AutoMapper suggestions to fetch
  React.useEffect(() => {
    if (!('automapperSuggestionsPromise' in state)) return;

    state.automapperSuggestionsPromise
      ?.then((automapperSuggestions) =>
        dispatch({
          type: 'AutomapperSuggestionsLoadedAction',
          automapperSuggestions,
        })
      )
      .catch(console.error);
  }, [
    'automapperSuggestionsPromise' in state
      ? state.automapperSuggestionsPromise
      : undefined,
  ]);

  const id=useId('wbplanview');

  return stateReducer(<i />, {
    ...state,
    props,
    dispatch,
    refObject,
    refObjectDispatch: refObjectDispatchCurried,
    id,
  });
}
