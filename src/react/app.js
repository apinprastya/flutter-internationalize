import React from 'react';
import { Modal, Button } from 'antd';

const App = (props) => {
    const [state, setState] = React.useState({ visible: false })

    const showModal = () => {
        setState({
            visible: true,
        });
    };

    const handleOk = e => {
        console.log(e);
        setState({
            visible: false,
        });
    };

    const handleCancel = e => {
        setState({
            visible: false,
        });
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Open Modal
        </Button>
            <Modal
                title="Basic Modal"
                visible={state.visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    );

}

export default App;

