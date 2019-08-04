import React from 'react'
import { Row, Col, Button } from 'antd'
import { GlobalStore } from './store'

const Action = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onSave = () => {
        if (!globalState.saving)
            dispatch({ type: 'save' })
    }

    const onAddRow = () => {
        dispatch({ type: 'addRow' })
    }

    return <Row>
        <Col span={24}>
            <Button onClick={onAddRow} icon="plus">Add Row</Button>
            {globalState.commands.length > 0 &&
                <Button style={{ marginLeft: 8 }} loading={globalState.saving} onClick={onSave} icon="save">Save</Button>}
        </Col>
    </Row>
}

export default Action;