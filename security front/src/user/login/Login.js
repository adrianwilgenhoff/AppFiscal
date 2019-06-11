import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';
import { Form, Input, Button, Icon, notification, Checkbox } from 'antd';
const FormItem = Form.Item;


class Login extends Component {

    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.form.validateFields();
    }


    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                    .then(response => {
                        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                        this.props.onLogin();
                    }).catch(error => {
                        if (error.status === 401) {
                            notification.error({
                                message: 'Fiscal App',
                                description: 'Your Username or Password is incorrect. Please try again!'
                            });
                        } else {
                            notification.error({
                                message: 'Fiscal App',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });
                        }
                    });
            }

        });
    }

    render() {
        const { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError } = this.props.form;
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" />}
                            size="large"
                            name="username"
                            placeholder="Username" />
                    )}
                </FormItem>
                <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" />}
                            size="large"
                            name="password"
                            type="password"
                            placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    <Link to="/reset-password">Forgot password</Link>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button"
                        disabled={hasErrors(getFieldsError())}> Login</Button>
                    Or <Link to="/signup">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}

export default Login;