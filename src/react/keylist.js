import React, { Fragment } from 'react'
import { List, Input } from 'antd';
import { GlobalStore } from './store'
import './index.css'

const KeyList = () => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onClick = (v) => {
        dispatch({ type: 'selectKey', payload: v })
    }

    const onSearch = v => {
        dispatch({ type: 'search', payload: v.target.value })
    }

    const onReset = () => {
        dispatch({ type: 'searchReset' })
    }

    return <div style={{ display: 'flex', flexFlow: 'column', height: '100%', marginLeft: 10 }}>
        <div style={{ textAlign: 'center', backgroundColor: '#303030', paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', borderBottom: '2px solid #404040' }}>
            KEYS
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Input placeholder="Search" value={globalState.search} onChange={onSearch} onReset={onReset} allowClear />
            </div>
        </div>
        <List
            rowKey="id"
            style={{ height: '100%', backgroundColor: '#303030', overflowY: 'auto' }}
            dataSource={globalState.search === '' ?
                globalState.data[globalState.currentGroup] :
                globalState.data[globalState.currentGroup].filter(v => {
                    return v._id.toUpperCase().includes(globalState.search.toUpperCase());
                })}
            renderItem={item => {
                return <div className={item._key === globalState.currentKey ? "group-list-selected" : "group-list"}
                    onClick={() => { onClick(item._key) }}>
                    {item._id}
                </div>
            }}
        />
    </div>
}

export default KeyList;