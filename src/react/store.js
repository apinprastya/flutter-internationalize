import React from 'react';

const GlobalStore = React.createContext();

const intialState = {
    loaded: false,
    data: null,
    currentGroup: '',
    groups: [],
    cols: [],
};

const mainReducer = (state, action) => {
    switch (action.type) {
        case 'initialLoaded': {
            return { ...state, ...action.payload, loaded: true, currentGroup: action.payload.groups[0] };
        }
        case 'updateRow': {
            const data = {
                ...state.data, [state.currentGroup]: state.data[state.currentGroup].map(v => {

                    if (v._key === action.payload._key) {
                        return { ...v, ...action.payload }
                    } else return v;
                })
            }
            return { ...state, data }
        }
        default: {
            return state;
        }
    }
}

const StoreProvider = ({ children }) => {
    const reducer = React.useReducer(mainReducer, intialState);
    const onMessage = msg => {
        const { data } = msg
        switch (data.type) {
            case 'initialLoaded': {
                reducer[1]({ type: 'initialLoaded', payload: data.data });
            }
        }
    }
    window.addEventListener('message', onMessage);
    return <GlobalStore.Provider value={reducer}>
        {children}
    </GlobalStore.Provider>
}

export { GlobalStore, StoreProvider }