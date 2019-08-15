import React from 'react';

window.inited = false
const GlobalStore = React.createContext();

const intialState = {
    loaded: false,
    data: null,
    currentGroup: '',
    groups: [],
    langs: [],
    cols: [],
    commands: [],
    saving: false,
    showAddGroup: false,
    groupNameValue: '',
    currentKey: undefined,
    selectedData: undefined,
    lastKey: 10000,
    search: '',
    groupEdit: '',
    langDrawerVisible: false,
    langEdit: '',
    currentLang: '',
    showAddLang: false,
    langNameValue: ''
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
                    if (v._key === state.currentKey) {
                        return { ...v, ...action.payload }
                    } else return v;
                })
            }
            vscode.postMessage({ type: 'save', payload: data })
            return { ...state, data, commands: [...state.commands, { 'group': state.currentGroup, type: 'updateRow', 'data': action.payload }] }
        }
        case 'insertNewRow': {
            const values = { ...action.payload, '_key': '' + (state.lastKey++) }
            const data = {
                ...state.data, [state.currentGroup]: [...state.data[state.currentGroup], values]
            }
            vscode.postMessage({ type: 'save', payload: data })
            return { ...state, data, currentKey: values['_key'], selectedData: values }
        }
        case 'removeRow': {
            const data = {
                ...state.data, [state.currentGroup]: state.data[state.currentGroup].filter(v => v._key !== action.payload)
            }
            vscode.postMessage({ type: 'save', payload: data })
            return {
                ...state, data, selectedData: undefined,
                commands: [...state.commands, { 'group': state.currentGroup, type: 'deleteRow', 'data': action.payload }]
            }
        }
        case 'addRow': {
            return {
                ...state, selectedData: {}, currentKey: undefined
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
            return { ...state, currentGroup: action.payload, currentKey: undefined, selectedData: undefined }
        }
        case 'addGroup': {
            const data = {
                ...state.data, [action.payload]: []
            }
            vscode.postMessage({ type: 'save', payload: data })
            return {
                ...state, data, currentGroup: action.payload, groupNameValue: '', showAddGroup: false,
                groups: [...state.groups, action.payload], commands: [...state.commands, { type: 'addGroup', data: action.payload }]
            }
        }
        case 'removeGroup': {
            const groups = state.groups.filter(v => v !== state.currentGroup)
            const { [state.currentGroup]: value, ...data } = state.data;
            vscode.postMessage({ type: 'save', payload: data })
            return { ...state, groups, currentGroup: groups[0], data, commands: [...state.commands, { type: 'removeGroup', data: state.currentGroup }] }
        }
        case 'showAddGroup': {
            return { ...state, showAddGroup: action.payload, groupEdit: '' }
        }
        case 'showEditGroup': {
            return { ...state, showAddGroup: true, groupEdit: action.payload }
        }
        case 'editGroup': {
            if (action.payload === state.groupEdit) {
                return state;
            }
            const { [state.groupEdit]: value, ...rest } = state.data
            const data = { ...rest, [action.payload]: state.data[state.groupEdit] };
            vscode.postMessage({ type: 'save', payload: data })
            return {
                ...state, data: data, groupEdit: '', showAddGroup: false, groups: state.groups.map(v => v === state.groupEdit ? action.payload : v),
                currentGroup: action.payload
            }
        }
        case 'changeGroupAddName': {
            return { ...state, groupNameValue: action.payload }
        }
        case 'selectKey': {
            return { ...state, currentKey: action.payload, selectedData: state.data[state.currentGroup].find(v => v._key === action.payload) }
        }
        case 'export': {
            vscode.postMessage({ type: 'export' })
            return state;
        }
        case 'import': {
            vscode.postMessage({ type: 'import' })
            return { ...state, loaded: false };
        }
        case 'generate': {
            vscode.postMessage({ type: 'generate' })
            return state;
        }
        case 'reload': {
            vscode.postMessage({ type: 'reload' })
            return { ...state, loaded: false, selectedData: undefined, currentKey: undefined };
        }
        case 'search': {
            return { ...state, search: action.payload }
        }
        case 'searchReset': {
            return { ...state, search: '' }
        }
        case 'showLangDrawer': {
            return { ...state, langDrawerVisible: action.payload }
        }
        case 'setCurrentLang': {
            return { ...state, currentLang: action.payload }
        }
        case 'showAddLang': {
            return { ...state, showAddLang: action.payload }
        }
        case 'addLang': {
            vscode.postMessage({ type: 'addLang', payload: action.payload })
            return { ...state, langs: [...state.langs, action.payload], showAddLang: false, currentKey: undefined, selectedData: undefined }
        }
        case 'removeLang': {
            vscode.postMessage({ type: 'removeLang', payload: state.currentLang })
            return { ...state, langs: state.langs.filter(v => v !== state.currentLang), currentKey: undefined, selectedData: undefined, currentLang: '' }
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
    if (!window.inited) {
        window.addEventListener('message', onMessage);
        window.inited = true
    }

    return <GlobalStore.Provider value={reducer}>
        {children}
    </GlobalStore.Provider>
}

export { GlobalStore, StoreProvider }