import React from 'react'
import { Row, Col, Select, Button, Divider } from 'antd'
import { GlobalStore } from './store'
import AddGroup from './addgroup';
import Action from './action'

const Control = () => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const groupChanged = v => {
        dispatch({ type: 'selectGroup', payload: v })
    }

    const onAddGroupClick = () => {
        dispatch({ type: 'showAddGroup', payload: true })
    }

    const onRemoveClick = () => {
        dispatch({ type: 'removeGroup' })
    }

    return <div style={{ paddingTop: 20 }}>
        <Action />
        <AddGroup />
        <div style={{ height: 20 }} />
    </div>
}

export default Control;