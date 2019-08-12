import React from 'react'
import { Drawer } from 'antd';
import { GlobalStore } from './store'

const LangDrawer = () => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const onClose = () => dispatch({ type: 'showLangDrawer', payload: false })

    return <Drawer visible={globalState.langDrawerVisible} width={600} onClose={onClose} title="Manage language">

    </Drawer>
}

export default LangDrawer;