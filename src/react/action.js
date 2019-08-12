import React from 'react'
import { Tooltip, Button, Popconfirm, Dropdown, Menu, Icon } from 'antd'
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

    const onReload = () => {
        dispatch({ type: 'reload' });
    }

    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'import':
                dispatch({ type: 'import' })
                break;
            case 'export':
                dispatch({ type: 'export' })
                break;
            case 'generate':
                dispatch({ type: 'generate' });
                break;
            case 'manage':
                dispatch({ type: 'showLangDrawer', payload: true })
                break;
        }
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="manage">
                <Icon type="unordered-list" />
                Manage language
          </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="import">
                <Icon type="upload" />
                Import excel
          </Menu.Item>
            <Menu.Item key="export">
                <Icon type="download" />
                Export excel
          </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="generate">
                <Icon type="exclamation" />
                Generate dart code
          </Menu.Item>
        </Menu>
    );

    return <div>
        <Button.Group>
            <Button type="default" icon="plus" onClick={onAddGroup}>Add group</Button>
            {globalState.groups.length > 1 &&
                <Popconfirm title="Sure to delete?" onConfirm={onRemoveGroup}>
                    <Button type="danger" icon="delete">Remove group</Button>
                </Popconfirm>
            }
        </Button.Group>
        <Button style={{ marginLeft: 10 }} onClick={onAddRow} icon="plus" type="default">Add key</Button>
        <Button.Group style={{ marginLeft: 10 }}>
            <Tooltip title="refresh" >
                <Button onClick={onReload} icon="reload" type="default"></Button>
            </Tooltip>
            <Dropdown overlay={menu}>
                <Button icon="more" type="default"></Button>
            </Dropdown>
        </Button.Group>
    </div>
}

export default Action;