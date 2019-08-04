import React from 'react';
import { Form, Input } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

class EditableCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            value: ''
        };
        this.onChange.bind(this)
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        this.toggleEdit();
    };

    onKeyDown = (event) => {
        if (event.keyCode === 13 && event.ctrlKey) {
            this.props.handleSave({ ...this.props.record, [this.props.dataIndex]: this.props.record[this.props.dataIndex] + '\n' });
        } else if (event.keyCode === 13) {
            this.toggleEdit();
        }
    }

    onChange = (e) => {
        this.props.handleSave({ ...this.props.record, [this.props.dataIndex]: e.target.value });
    }

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? <Input.TextArea value={record[dataIndex]} ref={node => (this.input = node)} onBlur={this.save} autosize={true} onChange={this.onChange} onKeyDown={this.onKeyDown} />
            : (
                <div
                    style={{ paddingRight: 24, whiteSpace: 'pre-line' }}
                    onClick={this.toggleEdit}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}
export { EditableRow, EditableContext }
export default EditableCell;