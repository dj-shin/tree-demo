import { createGenericSlice, TreeState } from './genericTree';
import { PayloadAction } from '@reduxjs/toolkit';

type NumericTreeData = number;
const initialState: TreeState<NumericTreeData> = {
  root: undefined,
  childMap: {},
  parentMap: {},
  nodeMap: {},
};
export interface UpdateNodePayload {
  id: string;
  data: number;
}
export const numericTreeSlice = createGenericSlice({
  name: 'numericTree',
  initialState,
  reducers: {
    // extended reducers
    updateNode: (state, action: PayloadAction<UpdateNodePayload>) => {
      const { id, data } = action.payload;
      state.nodeMap[id] += data;    // state.nodeMap[id]: T is inferred as number
    }
  }
});

export default numericTreeSlice.reducer;
