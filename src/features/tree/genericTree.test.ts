import {
  configureStore,
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers
} from '@reduxjs/toolkit';
import {
  TreeState,
  createGenericSlice,
  selectRoot,
  selectNode,
  selectChildren,
} from './genericTree';

const generateCommonState = () => ({ // to fixture? .json?
  root: '0',
  childMap: {
    '0': ['00', '01'],
    '00': ['000', '001'],
    '01': ['010', '011'],
  },
  parentMap: {
    '00': '0',
    '01': '0',
    '000': '00',
    '001': '00',
    '010': '01',
    '011': '01',
  },
  nodeMap: {
    '0': '0',
    '00': '00',
    '000': '000',
    '001': '001',
    '01': '01',
    '010': '010',
    '011': '011',
  },
});

const generateEmptyState = () => ({
  root: undefined,
  childMap: { },
  parentMap: { },
  nodeMap: { },
});

function makeStoreAndSlice<T>(
  createSlice,
  name: string = 'test',
  initialState: TreeState<T>,
  reducers?: ValidateSliceCaseReducers<TreeState<T>, Reducers>
) {
  const slice = createSlice({
    name,
    initialState,
    reducers,
  });

  const store = configureStore({
    reducer: slice.reducer
  });
  return { slice, store };
}

function makeEmptyGenericTree() {
  const { slice: genericTree, store } =
      makeStoreAndSlice(
        createGenericSlice,
        'empty tree',
        generateEmptyState()
      );
  return { genericTree, store };
}

function makeCommonGenericTree() {
  const { slice: genericTree, store } =
      makeStoreAndSlice(
        createGenericSlice,
        'common tree',
        generateCommonState()
      );
  return { genericTree, store };
}

describe('generic tree', () => {
  describe('selectors', () => {
    describe('empty state', () => {
      const { genericTree, store } = makeEmptyGenericTree();
      const state = store.getState();
      const someId: string = '0';

      it('select root', () => {
        expect(selectRoot(state)).toEqual(undefined);
      });

      it('select node', () => {
        expect(selectNode(state, someId)).toEqual(undefined);
      });

      it('select children', () => {
        expect(selectChildren(state, someId)).toEqual([]);
      });
    });

    describe('initial state', () => {
      const { genericTree, store } = makeCommonGenericTree();
      const state = store.getState();

      it('select root', () => {
        expect(selectRoot(state)).toEqual('0');
      });

      it('select node', () => {
        expect(selectNode(state, '0')).toEqual('0');
        expect(selectNode(state, '01')).toEqual('01');
        expect(selectNode(state, '000')).toEqual('000');
      });

      it('select children', () => {
        expect(selectChildren(state, '0')).toEqual(['00', '01']);
        expect(selectChildren(state, '01')).toEqual(['010', '011']);
        expect(selectChildren(state, '000')).toEqual([]);
      });
    });
  });

  describe('appendChild action', () => {
    describe('set root', () => {
      const { genericTree, store } = makeEmptyGenericTree();

      it('should make the root with undefined parent', () => {
        const rootId = '0';
        const data = '1';
        store.dispatch(genericTree.actions.appendChild({
          id: rootId,
          data
        }));
        const state = store.getState();
        expect(selectRoot(state)).toEqual(rootId);
        expect(selectNode(state, rootId)).toEqual(data);
      });

      it('should replace root with new one', () => {
        const newRootId = 'new-root';
        store.dispatch(genericTree.actions.appendChild({
          id: newRootId,
          data: 'new root'
        }));
        const state = store.getState();
        expect(selectRoot(state)).toEqual(newRootId);
      });
    });

    describe('having root, append child', () => {
      var genericTree, store;
      const rootId = '0';
      const rootData = '0';

      beforeEach(() => {
        const { genericTree: _genericTree, store: _store } = makeCommonGenericTree();
        genericTree = _genericTree;
        store = _store; // ?
      });

      it('should append child with valid parent id', () => {
        const id = 'childId';
        const data = 'childData';
        store.dispatch(genericTree.actions.appendChild({
          parent: rootId,
          id,
          data
        }));
        const state = store.getState();
        expect(selectNode(state, id)).toEqual(data);
        expect(state.parentMap[id]).toEqual(rootId);
        expect(selectChildren(state, rootId)).toEqual(['00', '01', id]);
      });

      it('should raise an error with duplicated id (?)', () => {
        // TODO
      });

      it('should raise an error with invalid parent id (?)', () => {
        // TODO
      });
    });
  });
});

