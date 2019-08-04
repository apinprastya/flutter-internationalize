import React from 'react';
import MyTable from './table/table'
import Control from './control'
import { StoreProvider } from './store'
import Action from './action'

const App = (props) => {
    return <StoreProvider>
        <Control />
        <MyTable />
        <div style={{ height: 10 }} />
        <Action />
    </StoreProvider>;
}

export default App;

