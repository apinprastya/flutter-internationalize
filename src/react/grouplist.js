import React, { Fragment } from 'react'
import { List } from 'antd';
import { GlobalStore } from './store'
import './index.css'

const GroupList = () => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onClick = (v) => {
        dispatch({ type: 'selectGroup', payload: v })
    }

    const onDoubleClick = (v) => {
        dispatch({ type: 'showEditGroup', payload: v })
    }

    return <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
        <div style={{ textAlign: 'center', backgroundColor: '#303030', paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', borderBottom: '2px solid #404040' }}>
            GROUPS
        </div>
        <List
            style={{ backgroundColor: '#303030', overflowY: 'auto' }}
            rowKey="id"
            dataSource={globalState.groups}
            renderItem={item => {
                return <div className={globalState.currentGroup === item ? "group-list-selected" : "group-list"}
                    onClick={() => { onClick(item) }} onDoubleClick={() => onDoubleClick(item)}>
                    {item}
                </div>
            }}
        />
    </div>
}

export default GroupList;