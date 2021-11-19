import type { State } from 'typesafe-reducer';
import { generateDispatch } from 'typesafe-reducer';

import type { SpecifyResource } from './components/wbplanview';
import * as navigation from './navigation';

type NavigateBackState = State<
  'NavigateBackState',
  {
    readonly wb: SpecifyResource;
  }
>;

export type LoadingStates = NavigateBackState;

export const loadingStateDispatch = generateDispatch<LoadingStates>({
  NavigateBackState: (state): void =>
    /*
     * Need to make the `Loading` dialog
     * appear before the `Leave Page?` dialog
     */
    void setTimeout(() => navigation.go(`/workbench/${state.wb.id}/`), 10),
});
