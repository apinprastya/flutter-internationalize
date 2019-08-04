import React from 'react'
import { GlobalStore } from './store'
import { Input, Button, Form, Popconfirm } from 'antd';

const Editor = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)
    const { getFieldDecorator, setFieldsValue } = props.form;

    const cols = ['_id', ...globalState.langs];

    const onSave = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                if (globalState.selectedData._key) dispatch({ type: 'updateRow', payload: values })
                else dispatch({ type: 'insertNewRow', payload: values })
            }
        });
    }

    React.useEffect(() => {
        if (globalState.selectedData) {
            const d = globalState.selectedData;
            let v = { '_id': d['_id'] }
            globalState.langs.forEach(e => {
                v[e] = d[e]
            });
            setFieldsValue(v)
        }
    }, [globalState.selectedData])

    const handleDelete = v => {
        dispatch({ type: 'removeRow', payload: v })
    }

    console.log(globalState.selectedData)

    return <Form style={{ marginLeft: 10 }} onSubmit={onSave}>
        {globalState.selectedData && <React.Fragment>
            {cols.map(v => {
                return <div style={{ marginBottom: 20 }} key={v}>
                    <div>{v}</div>
                    <Form.Item>
                        {getFieldDecorator(v, {
                            rules: v === '_id' ? [{ required: true, message: 'id required' }] : null,
                            //initialValue: globalState.selectedData[v],
                        })(
                            <Input.TextArea style={{ width: '100%' }} autosize />,
                        )}
                    </Form.Item>
                </div>
            })}
            <Button.Group>
                <Button type="default" htmlType="submit" icon="save">Save</Button>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(globalState.selectedData._key)}>
                    <Button type="danger" htmlType="submit" icon="delete">Remove</Button>
                </Popconfirm>

            </Button.Group>
        </React.Fragment>}
    </Form>
}

export default Form.create()(Editor);