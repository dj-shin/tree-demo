import { createSlice, PayloadAction, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';

export interface TreeState<T> {
  root?: string;
  childMap: { [id: string]: string[] };
  parentMap: { [id: string]: string };
  nodeMap: { [id: string]: T };
}
export interface AppendChildPayload<T> {
  parent?: string;
  id: string;
  data: T;
}

/**
 * Generic createSlice wrapper for tree state management
 * @param name - slice name
 * @param initialState
 * @param reducers - extended reducers upon instantiation
 */
export const createGenericSlice = <
  T,
  Reducers extends SliceCaseReducers<TreeState<T>>
  >({
      name = '',
      initialState,
      reducers
    }: {
  name: string
  initialState: TreeState<T>
  reducers: ValidateSliceCaseReducers<TreeState<T>, Reducers>
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      appendChild(state: TreeState<T>, action: PayloadAction<AppendChildPayload<T>>) {
        if (action.payload.parent === undefined) {
          // no parent == root
          state.root = action.payload.id;
        } else {
          if (!state.childMap[action.payload.parent]) {
            state.childMap[action.payload.parent] = [];
          }
          state.childMap[action.payload.parent].push(action.payload.id);
          state.parentMap[action.payload.id] = action.payload.parent;
        }
        state.nodeMap[action.payload.id] = action.payload.data;
      },
      ...reducers
    }
  })
}

export function selectNode<T> (state: TreeState<T>, id: string): T | undefined {
  return state.nodeMap[id];
}

const emptyList: [] = [];
export function selectChildren (state: TreeState<unknown>, id: string): string[] {
  return state.childMap[id] || emptyList; // using [] instead of 'emptyList' will invoke unnecessary updates
}

export function selectRoot(state: TreeState<unknown>): string | undefined {
  return state.root;
}
