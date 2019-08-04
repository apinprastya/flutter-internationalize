import React from 'react';

const GlobalStore = React.createContext();

const intialState = {
    loaded: false,
    data: null,
    currentGroup: '',
    groups: [],
    cols: [],
    commands: [],
    saving: false,
    showAddGroup: false,
    groupNameValue: ''
};

const vscode = acquireVsCodeApi();

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
            return { ...state, data, commands: [...state.commands, { 'group': state.currentGroup, type: 'updateRow', 'data': action.payload }] }
        }
        case 'removeRow': {
            const data = {
                ...state.data, [state.currentGroup]: state.data[state.currentGroup].filter(v => v._key !== action.payload)
            }
            return {
                ...state, data,
                commands: [...state.commands, { 'group': state.currentGroup, type: 'deleteRow', 'data': action.payload }]
            }
        }
        case 'addRow': {
            const newData = { _key: state.data[state.currentGroup].length, _id: '' };
            const data = {
                ...state.data, [state.currentGroup]: [...state.data[state.currentGroup], newData]
            }
            return {
                ...state, data,
                commands: [...state.commands, { 'group': state.currentGroup, type: 'addRow', 'data': { _key: state.data[state.currentGroup].length, _id: '' } }]
            }
        }
        case 'save': {
            vscode.postMessage({ type: 'save', payload: state.commands })
            return { ...state, saving: true };
        }
        case 'saved': {
            return { ...state, saving: false, commands: [] };
        }
        case 'selectGroup': {
            return { ...state, currentGroup: action.payload }
        }
        case 'addGroup': {
            const data = {
                ...state.data, [action.payload]: []
            }
            return {
                ...state, data, currentGroup: action.payload, groupNameValue: '', showAddGroup: false,
                groups: [...state.groups, action.payload], commands: [...state.commands, { type: 'addGroup', data: action.payload }]
            }
        }
        case 'removeGroup': {
            const groups = state.groups.filter(v => v !== state.currentGroup)
            return { ...state, groups, currentGroup: groups[0], commands: [...state.commands, { type: 'removeGroup', data: state.currentGroup }] }
        }
        case 'showAddGroup': {
            return { ...state, showAddGroup: action.payload }
        }
        case 'changeGroupAddName': {
            return { ...state, groupNameValue: action.payload }
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
            case 'saved': {
                reducer[1]({ type: 'saved' });
            }
        }
    }
    window.addEventListener('message', onMessage);

    return <GlobalStore.Provider value={reducer}>
        {children}
    </GlobalStore.Provider>
}

export { GlobalStore, StoreProvider }