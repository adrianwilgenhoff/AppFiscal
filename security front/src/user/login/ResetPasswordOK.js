import React, { Component } from 'react';
import { Card, Button, Row } from 'antd';
import { Link } from 'react-router-dom';
import './ResetPasswordOK.css';

class ResetPasswordOK extends Component {
    state = {}

    render() {
        return (
            <div className="container-card">
                <Card title="Reset Password" style={{ width: 500 }}>
                    <Row type='flex' justify='center'>
                        <h1>Check your inbox for the next steps. </h1>
                        <h3>We just sent an email to you with a link to reset your password!</h3>
                        <h3>If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address.</h3>
                    </Row>
                    <Link to="/login">
                        <Button type="primary" size="large" className="resetpasswordok-form-button"
                        > CLICK HERE TO PROCEED</Button>
                    </Link>
                </Card>
            </div >
        );
    }
}

export default ResetPasswordOK;