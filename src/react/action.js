import React from 'react'
import { Row, Col, Button, Popconfirm } from 'antd'
import { GlobalStore } from './store'

const Action = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onAddRow = () => {
        dispatch({ type: 'addRow' })
    }

    const onAddGroup = () => {
        dispatch({ type: 'showAddGroup', payload: true });
    }

    const onRemoveGroup = () => {
        dispatch({ type: 'removeGroup' })
    }

    return <Row>
        <Col span={24}>
            <Button.Group>
                <Button type="default" icon="plus" onClick={onAddGroup}>Add group</Button>
                {globalState.groups.length > 1 &&
                    <Popconfirm title="Sure to delete?" onConfirm={onRemoveGroup}>
                        <Button type="danger" icon="delete">Remove group</Button>
                    </Popconfirm>
                }
            </Button.Group>
            <Button style={{ marginLeft: 10 }} onClick={onAddRow} icon="plus" type="default">Add key</Button>
        </Col>
    </Row>
}

export default Action;