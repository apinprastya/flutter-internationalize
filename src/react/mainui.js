import React from 'react'
import { GlobalStore } from './store'
import GroupList from './grouplist';
import { Row, Col } from 'antd';
import KeyList from './keylist';
import Editor from './editor';
import LangDrawer from './langdrawer';
import AddLang from './addlang'

const MainUI = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)
    return !globalState.loaded ? 'Loading...' :
        <Row>
            <Col span={4}>
                <GroupList />
            </Col>
            <Col span={6}>
                <div style={{ marginLeft: 10 }}>
                    <KeyList />
                </div>
            </Col>
            <Col span={14}>
                <Editor />
            </Col>
            <LangDrawer />
            <AddLang />
        </Row>
}

export default MainUI;