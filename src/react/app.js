import React from 'react';
import MyTable from './table/table'
import Control from './control'
import { StoreProvider } from './store'

const App = (props) => {
    return <StoreProvider>
        <Control />
        <MyTable />
    </StoreProvider>;
}

export default App;

