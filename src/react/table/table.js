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

    const handleDelete = key => {
        dispatch({ type: 'removeRow', payload: key })
    }

    const cols1 = [...cols, {
        title: 'op',
        dataIndex: 'operation',
        render: (text, record) =>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._key)}>
                <a href="javascript:;">Delete</a>
            </Popconfirm>
    }];

    return !globalState.loaded ? 'LOADING...' :
        <div>
            <Table
                rowKey="_key"
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={globalState.data[globalState.currentGroup]}
                columns={cols1}
                size="small"
                pagination={false}
            />
        </div>;
}

export default MyTable;