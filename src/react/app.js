import React from 'react';
import Control from './control'
import { StoreProvider } from './store'
import MainUI from './mainui';

const App = () => {
    return <StoreProvider>
        <div style={{ display: 'flex', flexFlow: 'column', height: '100%', paddingBottom: 10 }}>
            <Control />
            <MainUI />
        </div>
    </StoreProvider>;
}

export default App;

