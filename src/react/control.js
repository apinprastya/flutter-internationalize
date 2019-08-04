import React from 'react'
import { Row, Col, Select, Button, Divider } from 'antd'
import { GlobalStore } from './store'
import AddGroup from './addgroup';
import Action from './action'

const Control = (props) => {
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
        <Action />
        <AddGroup />
        <div style={{ height: 20 }} />
    </div>
}

export default Control;