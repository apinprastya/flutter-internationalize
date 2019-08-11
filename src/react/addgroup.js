import React from 'react'
import { Modal, Input, message, Form } from 'antd';
import { GlobalStore } from './store'

const AddGroup = (props) => {
    const [globalState, dispatch] = React.useContext(GlobalStore)
    const { getFieldDecorator, setFieldsValue, validateFields } = props.form;

    React.useEffect(() => {
        setFieldsValue({ 'name': globalState.groupEdit })
    }, [globalState.groupEdit])

    const onCancel = () => {
        dispatch({ type: 'showAddGroup', payload: false })
    }

    const onOK = () => {
        validateFields((err, values) => {
            if (!err) {
                dispatch({ type: globalState.groupEdit === '' ? 'addGroup' : 'editGroup', payload: values.name })
            }
        });
    }

    const onChange = (e) => {
        dispatch({ type: 'changeGroupAddName', payload: e.target.value })
    }

    const validText = (rule, value, callback) => {
        const re = /[a-zA-Z]\w+$/
        re.test(value) ? callback() : callback([new Error('Only alpha, digit and _ allowed')])
    }

    const keyNotExist = (rule, value, callback) => {
        const arr = globalState.groups;
        if (value === globalState.groupEdit) {
            callback();
        } else {
            const found = arr.find(v => v === value)
            !found ? callback() : callback([new Error('Key already exist')])
        }
    }

    return <Modal title={globalState.groupEdit === '' ? "Add new group" : "Edit group"} visible={globalState.showAddGroup} onCancel={onCancel} onOk={onOK} okText="Save">
        <Form name='addgroup'>
            <Form.Item>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'id required' }, { validator: validText }, { validator: keyNotExist }],
                    initialValue: globalState.groupEdit
                })(
                    <Input onChange={onChange} placeholder="Input group name" />
                )}
            </Form.Item>
        </Form>
    </Modal>
}

export default Form.create({ 'name': 'addgroup' })(AddGroup);