import React from 'react'
import { Table, Form, Popconfirm } from 'antd';
import EditableCell, { EditableRow } from './editablecell'
import { GlobalStore } from '../store'

const EditableFormRow = Form.create()(EditableRow);

const MyTable = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)

    const components = {
        body: {
            row: EditableFormRow,
            cell: EditableCell,
        },
    };

    /*{
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
            dataSource.length >= 1 ? (
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                    <a href="javascript:;">Delete</a>
                </Popconfirm>
            ) : null,
    },*/

    const handleSave = row => {
        dispatch({ type: 'updateRow', payload: row })
    }

    const cols = globalState.cols.map(col => {
        return {
            title: col,
            dataIndex: col,
            onCell: record => ({
                record,
                editable: true,
                dataIndex: col,
                title: col,
                handleSave: handleSave,
            }),
            render: (s) => s || '#empty#'
        };
    });

    return !globalState.loaded ? 'LOADING...' :
        <div>
            <Table
                rowKey="_key"
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={globalState.data[globalState.currentGroup]}
                columns={cols}
                size="small"
                pagination={false}
            />
        </div>;
}

export default MyTable;