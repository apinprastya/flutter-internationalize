import React from 'react'
import { List } from 'antd';
import { GlobalStore } from './store'
import './index.css'

const GroupList = () => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onClick = (v) => {
        dispatch({ type: 'selectGroup', payload: v })
    }

    return <List
        style={{ height: 600, backgroundColor: '#303030' }}
        rowKey="id"
        dataSource={globalState.groups}
        header={<div style={{ paddingLeft: 10, fontWeight: 'bold' }}>Groups</div>}
        renderItem={item => {
            return <div className={globalState.currentGroup === item ? "group-list-selected" : "group-list"}
                onClick={() => { onClick(item) }}>
                {item}
            </div>
        }}
    />
}

export default GroupList;