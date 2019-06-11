import React from "react";

import { changePassword } from '../../util/APIUtils';
import { Form, Input, Button, notification } from "antd";
import LoadingIndicator from '../../common/LoadingIndicator';
import './ChangePassword.css';


class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: {
                value: ''
            },
            newPassword: {
                value: ''
            },
            confirmDirty: false,
            isLoading: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            isLoading: true
        });
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const signupChangePassword = {
                    currentPassword: values.currentPassword,
                    newPassword: values.password,
                };
                changePassword(signupChangePassword)
                    .then(response => {
                        notification.success({
                            message: 'Fiscal App',
                            description: "You're successfully change Password!",
                        });
                        this.setState({
                            isLoading: false
                        });
                    }).catch(error => {
                        notification.error({
                            message: 'Fiscal App',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                        this.setState({
                            isLoading: false
                        });
                    });
            }
        });
    };

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    render() {

        const { getFieldDecorator } = this.props.form;
        if (this.state.isLoading) {
            return <LoadingIndicator />
        }
        return (
            <Form label="Change Password" onSubmit={this.handleSubmit} className="changePassword-container">
                <Form.Item label="Current Password">
                    {getFieldDecorator("currentPassword", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your current password!"
                            },
                        ]
                    })(<Input.Password size="large" placeholder="Your current password" />)}
                </Form.Item>
                <Form.Item label="New Password" hasFeedback>
                    {getFieldDecorator("password", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your new password!"
                            },
                            {
                                validator: this.validateToNextPassword
                            }
                        ]
                    })(<Input.Password size="large" />)}
                </Form.Item>
                <Form.Item size="large" label="Confirm Password" hasFeedback>
                    {getFieldDecorator("confirm", {
                        rules: [
                            {
                                required: true,
                                message: "Please confirm your password!"
                            },
                            {
                                validator: this.compareToFirstPassword
                            }
                        ]
                    })(<Input.Password size="large" onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" size="large" htmlType="submit" className="changePassword-form-button">
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(ChangePassword);