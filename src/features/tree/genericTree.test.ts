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

describe('generic tree', () => {
  const genericTree = createGenericSlice({
    name: 'genericTree',
  });
  describe('selectors', () => {
    describe('empty state', () => {
      const state = generateEmptyState();
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
      const state = generateCommonState();

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
      it('should make the root with undefined parent', () => {
        const rootId = '0';
        const data = '1';

        // set root
        const state = generateEmptyState();
        genericTree.caseReducers.appendChild(state, genericTree.actions.appendChild({
          id: rootId,
          data
        }));

        expect(selectRoot(state)).toEqual(rootId);
        expect(selectNode(state, rootId)).toEqual(data);
      });

      it('should replace root with new one', () => {
        const rootId = '0';
        const data = '1';

        // make root node
        const state = generateEmptyState();
        genericTree.caseReducers.appendChild(state, genericTree.actions.appendChild({
          id: rootId,
          data
        }));

        // replace root with new one
        const newRootId = 'new-root';
        genericTree.caseReducers.appendChild(state, genericTree.actions.appendChild({
          id: newRootId,
          data: 'new root'
        }));

        expect(selectRoot(state)).toEqual(newRootId);
      });
    });

    describe('having root, append child', () => {
      it('should append child with valid parent id', () => {
        const id = 'childId';
        const data = 'childData';

        // get root and append child on it
        const state = generateCommonState();
        const rootId = selectRoot(state);
        genericTree.caseReducers.appendChild(state, genericTree.actions.appendChild({
          parent: rootId,
          id,
          data
        }));

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

