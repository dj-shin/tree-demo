import React, { useEffect } from 'react';
import './App.css';
import { TreeList } from './features/tree/TreeList';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoot } from './features/tree/genericTree';
import { numericTreeSlice } from './features/tree/numericTree';
import { RootState } from './app/store';

function App() {
  const root = useSelector((state: RootState) => selectRoot(state.numericTree));
  const dispatch = useDispatch();

  // setup initial state
  useEffect(() => {
    dispatch(numericTreeSlice.actions.appendChild({ id: '1', data: 1 }));
    dispatch(numericTreeSlice.actions.appendChild({ parent: '1', id: '2', data: 2 }));
    dispatch(numericTreeSlice.actions.appendChild({ parent: '1', id: '3', data: 3 }));
    dispatch(numericTreeSlice.actions.appendChild({ parent: '2', id: '4', data: 4 }));
    dispatch(numericTreeSlice.actions.appendChild({ parent: '2', id: '5', data: 5 }));
  }, [dispatch]);
  return (
    root ? <TreeList id={root}/> : <div>empty</div>
  );
}

export default App;
