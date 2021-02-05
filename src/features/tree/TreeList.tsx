import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChildren, selectNode } from './genericTree';
import { RootState } from '../../app/store';
import { numericTreeSlice } from './numericTree';

interface TreeListProps {
  id: string;
}
export const TreeList: React.FunctionComponent<TreeListProps> = (props) => {
  const id = props.id;
  console.log(`TreeList ${id}`)   // re-render check
  const nodeData = useSelector((state: RootState) => selectNode(state.numericTree, id));
  const children = useSelector((state: RootState) => selectChildren(state.numericTree, id));
  const childrenList = useMemo(() => children.map(id => (<TreeList key={id} id={id}/>)), [children]);
  const dispatch = useDispatch();

  const addOne = useCallback(() => {
    dispatch(numericTreeSlice.actions.updateNode({
      id,
      data: 1
    }));
  }, [dispatch, id]);
  const appendChild = useCallback(() => {
    dispatch(numericTreeSlice.actions.appendChild({
      parent: id,
      id: `${id}-${children.length}`,
      data: Math.random(),
    }));
  }, [dispatch, id, children]);

  return (
    <ul>
      <li>
        {id} : {nodeData?.toFixed(2)}
        <button onClick={addOne}>Add 1</button>
        <button onClick={appendChild}>Append Child</button>
      </li>
      {childrenList}
    </ul>
  );
}
