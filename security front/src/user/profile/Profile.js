import React, { Component } from 'react';
import { getUserProfile, updateProfile } from '../../util/APIUtils';
import { Avatar, Button, Icon, Layout, Modal, Form, Input, Tooltip, notification, Tag } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator from '../../common/LoadingIndicator';
import { Link } from 'react-router-dom';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';

const { Content } = Layout;

const EditModal = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {

        state = {
            disabled: true,
            disabledName: true,
            disabledLastname: true,
            disabledEmail: true,
        };

        toggleName = () => {
            this.setState({
                disabledName: !this.state.disabledName,
            });
        };

        toggleLastName = () => {
            this.setState({
                disabledLastname: !this.state.disabledLastname,
            });
        };

        toggleEmail = () => {
            this.setState({
                disabledEmail: !this.state.disabledEmail,
            });
        };

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Edit Profile"
                    okText="Save"
                    onCancel={onCancel}
                    onOk={onCreate}>
                    <Form layout="vertical">
                        <Form.Item label="Username">
                            {getFieldDecorator('username', {
                                initialValue: this.props.user.username,
                            })(
                                <Input
                                    disabled={true} />)}
                        </Form.Item>
                        <Form.Item label="Name">
                            {getFieldDecorator('name', {
                                initialValue: this.props.user.name,
                            })(
                                <Input
                                    type="text"
                                    disabled={this.state.disabledName}
                                    suffix={
                                        <Tooltip title="Edit Name">
                                            <Icon type="edit" style={{ color: 'rgba(0,0,0,.45)' }} onClick={this.toggleName} />
                                        </Tooltip>
                                    }
                                />)}
                        </Form.Item>
                        <Form.Item label="Last Name">
                            {getFieldDecorator('lastname', {
                                initialValue: this.props.user.lastname,
                            })(
                                <Input
                                    type="text"
                                    disabled={this.state.disabledLastname}
                                    suffix={
                                        <Tooltip title="Edit Last Name">
                                            <Icon type="edit" style={{ color: 'rgba(0,0,0,.45)' }} onClick={this.toggleLastName} />
                                        </Tooltip>
                                    }
                                />)}
                        </Form.Item>
                        <Form.Item label="Email">
                            {getFieldDecorator('email', {
                                initialValue: this.props.user.email,
                            })(
                                <Input
                                    type="text"
                                    disabled={this.state.disabledEmail}
                                    suffix={
                                        <Tooltip title="Edit Email">
                                            <Icon type="edit" style={{ color: 'rgba(0,0,0,.45)' }} onClick={this.toggleEmail} />
                                        </Tooltip>
                                    }
                                />)}
                        </Form.Item>
                        <Form.Item label="Created Date">
                            {getFieldDecorator('createdDate', {
                                initialValue: this.props.user.createdDate,
                            })(
                                <Input
                                    disabled={true} />)}
                        </Form.Item>
                        <Form.Item label="Authorities">
                            {getFieldDecorator('authorities', {
                                initialValue: this.props.user.authorities,
                            })(
                                <Tag color="black">{this.props.user.authorities[0].authority}</Tag>,
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            visible: false,
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {

        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const signupRequest = {
                firstName: values.name,
                lastName: values.lastname,
                email: values.email,
            };
            updateProfile(signupRequest)
                .then(response => {
                    notification.success({
                        message: 'Fiscal App',
                        description: "You're successfully updated!",
                    });
                    this.setState({ user: values });
                }).catch(error => {
                    notification.error({
                        message: 'Fiscal App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.notFound) {
            return <NotFound />;
        }

        if (this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                <Layout>
                    <Content>{
                        this.state.user ? (
                            <div className="user-profile">
                                <div className="user-details">
                                    <div className="user-avatar">
                                        <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name) }}>
                                            {this.state.user.name[0].toUpperCase()}
                                        </Avatar>
                                    </div>
                                    <div className="user-summary">
                                        <div className="full-name">{this.state.user.name}</div>
                                        <div className="full-name">{this.state.user.lastname}</div>
                                        <div className="username">@{this.state.user.username}</div>
                                        <div className="email">{this.state.user.email}</div>
                                        <div className="user-roles">
                                            {this.state.user.authorities[0].authority}
                                            {/* <ul>
                                                {this.state.user.authorities.map(function (listValue) {
                                                    return <li key={listValue.authority}
                                                    >
                                                        {listValue.authority}</li>;
                                                })}
                                            </ul> */}
                                        </div>
                                        <div className="user-joined">
                                            Joined {formatDate(this.state.user.createdDate)}
                                        </div>
                                    </div>
                                </div>
                                <div className="button wrapper">
                                    <Button type="primary" onClick={this.showModal} className="user-profile-button"  >
                                        <Icon type="edit" /> Edit Profile
                                        </Button>
                                    <EditModal
                                        wrappedComponentRef={this.saveFormRef}
                                        visible={this.state.visible}
                                        onCancel={this.handleCancel}
                                        onCreate={this.handleCreate}
                                        user={this.state.user}
                                    />
                                    <Link to={`/user/${this.state.user.username}/change-password`}>
                                        <Button type="primary" className="user-profile-button">
                                            <Icon type="edit" /> Change Password
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : null
                    }
                    </Content>
                </Layout>
            </div>

        );
    }
}
export default Profile;
