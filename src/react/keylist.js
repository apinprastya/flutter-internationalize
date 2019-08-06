import React from 'react'
import { List } from 'antd';
import { GlobalStore } from './store'
import './index.css'

const KeyList = () => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onClick = (v) => {
        dispatch({ type: 'selectKey', payload: v })
    }

    return <List
        rowKey="id"
        style={{ height: 600, backgroundColor: '#303030', overflowY: 'auto' }}
        dataSource={globalState.data[globalState.currentGroup]}
        header={<div style={{ paddingLeft: 10, fontWeight: 'bold' }}>Keys</div>}
        renderItem={item => {
            return <div className={item._key === globalState.currentKey ? "group-list-selected" : "group-list"}
                onClick={() => { onClick(item._key) }}>
                {item._id}
            </div>
        }}
    />
}

export default KeyList;