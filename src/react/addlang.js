import React from 'react'
import { Modal, Input, Form } from 'antd';
import { GlobalStore } from './store'

const AddLang = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)
    const { getFieldDecorator, setFieldsValue, validateFields, resetFields } = props.form;

    React.useEffect(() => {
        setFieldsValue({ 'name': globalState.langEdit })
    }, [globalState.langEdit])

    const onCancel = () => {
        dispatch({ type: 'showAddLang', payload: false })
        resetFields(['name'])
    }

    const onOK = () => {
        validateFields((err, values) => {
            if (!err) {
                dispatch({ type: globalState.langEdit === '' ? 'addLang' : 'editLang', payload: values.name })
            }
        });
    }

    const validText = (rule, value, callback) => {
        const re = /^[a-zA-Z].*$/
        const re2 = /\w+$/;
        if (!re.test(value)) callback([new Error('must start with alpha')])
        else if (!re2.test(value)) callback([new Error('only alpha, number and _ allowed')])
        callback()
    }

    const keyNotExist = (rule, value, callback) => {
        const arr = globalState.langs;
        if (value === globalState.langEdit) {
            callback();
        } else {
            const found = arr.find(v => v === value)
            !found ? callback() : callback([new Error('Key already exist')])
        }
    }

    return <Modal title={globalState.langEdit === '' ? "Add new lang" : "Edit lang"} visible={globalState.showAddLang} onCancel={onCancel} onOk={onOK} okText="Save">
        <Form name='addlang'>
            <Form.Item>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'id required' }, { validator: validText }, { validator: keyNotExist }],
                    initialValue: globalState.langEdit
                })(
                    <Input placeholder="Input language name (EN, DE, ID, etc)" />
                )}
            </Form.Item>
        </Form>
    </Modal>
}

export default Form.create({ 'name': 'addlang' })(AddLang);