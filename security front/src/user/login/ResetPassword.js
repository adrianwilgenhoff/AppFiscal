import React, { Component } from 'react';
import { resetPassword } from '../../util/APIUtils';
import './ResetPassword.css';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../common/LoadingIndicator';
import { Form, Input, Button, Icon, notification } from 'antd';

const FormItem = Form.Item;

class ResetPassword extends Component {

    render() {
        const AntWrappedResetPasswordForm = Form.create()(ResetPasswordForm)
        return (
            <div className="resetPassword-container">
                <h1 className="page-title">Forgot Password</h1>
                <h4>Enter your email address and we'll send you a new password</h4>
                <div className="resetPassword-content">
                    <AntWrappedResetPasswordForm onResetPassword={this.props.onResetPassword} />
                </div>
            </div>
        );
    }
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            isLoading: true
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const value = Object.assign({}, values);
                resetPassword(value.email)
                    .then(response => {
                        notification.success({
                            message: 'Fiscal App',
                            description: "Check your inbox!! " + response.message,
                        });
                        this.setState({
                            isLoading: false
                        });
                        //this.props.history.push("/reset-password-ok");
                    }).catch(error => {
                        if (error.status === 409) {
                            notification.error({
                                message: 'Fiscal App',
                                description: 'Email Not found!'
                            });
                            this.setState({
                                isLoading: false
                            });
                        } else {
                            notification.error({
                                message: 'Fiscal App',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });
                            this.setState({
                                isLoading: false
                            });
                        }
                    }
                    );
            }

        });
    }

    render() {

        if (this.state.isLoading) {
            return <LoadingIndicator />
        }
        const { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError } = this.props.form;
        const emailError = isFieldTouched('email') && getFieldError('email');
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ],
                    })(
                        <Input
                            prefix={<Icon type="mail" />}
                            size="large"
                            name="email"
                            placeholder="Email Address" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button"
                        disabled={hasErrors(getFieldsError())}> Reset Password</Button>
                    <Link to="/login">Log In</Link> Or <Link to="/signup">Sign Up</Link>
                </FormItem>
            </Form>
        );
    }
}

export default ResetPassword;