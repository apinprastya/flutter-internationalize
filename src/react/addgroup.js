import React from 'react'
import { Modal, Input, message } from 'antd';
import { GlobalStore } from './store'

const AddGroup = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onCancel = () => {
        dispatch({ type: 'showAddGroup', payload: false })
    }

    const onOK = () => {
        if (globalState.groupNameValue === '') {
            message.error('Name can not empty!')
        } else {
            dispatch({ type: 'addGroup', payload: globalState.groupNameValue })
        }
    }

    const onChange = (e) => {
        dispatch({ type: 'changeGroupAddName', payload: e.target.value })
    }

    return <Modal title="Add new group" visible={globalState.showAddGroup} onCancel={onCancel} onOk={onOK} okText="Save">
        <Input value={globalState.groupNameValue} onChange={onChange} placeholder="Input group name" />
    </Modal>
}

export default AddGroup;