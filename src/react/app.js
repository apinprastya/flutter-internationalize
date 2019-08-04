import React from 'react';
import Control from './control'
import { StoreProvider } from './store'
import MainUI from './mainui';

const App = () => {
    return <StoreProvider>
        <Control />
        <MainUI />
    </StoreProvider>;
}

export default App;

