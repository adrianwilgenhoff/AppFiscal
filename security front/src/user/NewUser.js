import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './NewUser.css';
import { Form, Input, Button, Icon, Select, Col, notification, Modal, Checkbox } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

class NewUser extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    state = { visible: true };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>Remember me</Checkbox>)}
                            <a className="login-form-forgot" href="">
                                Forgot password
          </a>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
          </Button>
                            Or <a href="">register now!</a>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
const WrappedLogin = Form.create()(NewUser)
ReactDOM.render(<WrappedLogin />, document.getElementById('root'))
export default WrappedLogin;