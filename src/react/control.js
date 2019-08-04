import React from 'react'
import { Row, Col, Select, Button, Divider } from 'antd'
import { GlobalStore } from './store'
import AddGroup from './addgroup';

const Action = (props) => {
    return <Row>
        <Col span={24}>
            <Button onClick={props.onAddRow} icon="plus">Add Row</Button>
            {props.commands.length > 0 &&
                <Button style={{ marginLeft: 8 }} loading={props.saving} onClick={props.onSave} icon="save">Save</Button>}
        </Col>
    </Row>
}

const Control = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const groupChanged = v => {
        dispatch({ type: 'selectGroup', payload: v })
    }

    const onAddGroupClick = () => {
        dispatch({ type: 'showAddGroup', payload: true })
    }

    const onAddRow = () => {
        dispatch({ type: 'addRow' })
    }

    const onRemoveClick = () => {
        dispatch({ type: 'removeGroup' })
    }

    const onSave = () => {
        if (!globalState.saving)
            dispatch({ type: 'save' })
    }

    return <div style={{ paddingTop: 20 }}>
        <p>Flutter Internationalize</p>
        <Row>
            <Col span={4}>Current group</Col>
            <Col span={8}>
                <Select style={{ width: '100%' }} value={globalState.currentGroup} onChange={groupChanged}>
                    {globalState.groups.map(v => <Select.Option value={v} key={v}>{v}</Select.Option>)}
                </Select>
            </Col>
            {globalState.groups.length > 1 &&
                <Col span={12}>
                    <Button onClick={onRemoveClick} icon="delete" type="danger">Remove group</Button>
                </Col>
            }
        </Row>
        <Row style={{ paddingTop: 4 }}>
            <Col span={4}></Col>
            <Col span={8}>
                <Button icon="plus" onClick={onAddGroupClick}>Add new group</Button>
            </Col>
        </Row>
        <Divider />
        <Action saving={globalState.saving} commands={globalState.commands} onAddRow={onAddRow} onSave={onSave} />
        <AddGroup />
        <div style={{ height: 20 }} />
    </div>
}

export default Control;