
import React, { Component } from 'react';
import { Card, Button, Row } from 'antd';
import { Link } from 'react-router-dom';
import './ActivationForm.css';

class ActivationForm extends Component {
    state = {}

    render() {
        return (
            <div className="container-card">
                <Card title="Welcome to Fiscal App" style={{ width: 500 }}>
                    <Row type='flex' justify='center'>
                        <h1>Your account has been activated correctly</h1>
                    </Row>
                    <Link to="/login">
                        <Button type="primary" size="large" className="activation-form-button"
                        > CLICK HERE TO PROCEED</Button>
                    </Link>
                </Card>
            </div >
        );
    }
}

export default ActivationForm;