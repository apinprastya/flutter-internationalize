import React from 'react'
import { Drawer, List, Row, Popconfirm, Button } from 'antd';
import { GlobalStore } from './store'

const LangDrawer = () => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onClose = () => dispatch({ type: 'showLangDrawer', payload: false })

    const onClick = (item) => {
        dispatch({ type: 'setCurrentLang', payload: item })
    }

    const onAddLang = () => {
        dispatch({ type: 'showAddLang', payload: true })
    }
    const onRemoveLang = () => {
        dispatch({ type: 'removeLang' })
    }

    return <Drawer visible={globalState.langDrawerVisible} width={400} onClose={onClose} title="Manage language">
        <Row>
            <Button.Group>
                <Button type="default" icon="plus" onClick={onAddLang}>Add lang</Button>
                {globalState.langs.length > 2 && globalState.currentLang !== '' &&
                    <Popconfirm title="Sure to delete?" onConfirm={onRemoveLang}>
                        <Button type="danger" icon="delete">Remove lang</Button>
                    </Popconfirm>
                }
            </Button.Group>
        </Row><div style={{ marginTop: 20 }} />
        <React.Fragment>
            <div style={{ textAlign: 'center', backgroundColor: '#303030', paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', borderBottom: '2px solid #404040' }}>
                Available Languages
        </div>
            <List
                style={{ height: 200, backgroundColor: '#303030' }}
                rowKey="id"
                dataSource={globalState.langs.filter(v => v != 'desc')}
                renderItem={item => {
                    return <div className={globalState.currentLang === item ? "group-list-selected" : "group-list"}
                        onClick={() => { onClick(item) }} >
                        {item}
                    </div>
                }}
            />
        </React.Fragment>
    </Drawer>
}

export default LangDrawer;