import React from 'react';
import MyTable from './table/table'
import { StoreProvider } from './store'

const App = (props) => {
    return <StoreProvider><MyTable /></StoreProvider>;
}

export default App;

