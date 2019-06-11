import React from 'react';
import { getAllUser, deleteUser, createUser, editUser } from '../util/APIUtils';
import './UserTable.css';
import { Table, Input, Radio, Select, Modal, Button, Popconfirm, Form, Divider, Checkbox, notification, Icon } from 'antd';

const RadioGroup = Radio.Group;
const Option = Select.Option;

function handleChange(value) {
    console.log(`selected ${value}`);
}

// Modal Add user

const AddModal = Form.create({ name: 'form_in_modalAdd' })(
    // eslint-disable-next-line

    class extends React.Component {

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Add User"
                    okText="Save"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="Username">
                            {getFieldDecorator('login', {
                                rules: [{ required: true, message: 'Please input the username!' }],
                            })(<Input placeholder="A unique username" />)}
                        </Form.Item>
                        <Form.Item label="Name">
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: 'Please input the name!' }],
                            })(<Input placeholder="A name" />)}
                        </Form.Item>

                        <Form.Item label="Last Name">
                            {getFieldDecorator('lastName', {
                                rules: [{ required: true, message: 'Please input the lastname!' }],
                            })(<Input placeholder="A last name" />)}
                        </Form.Item>

                        <Form.Item label="Email">
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: 'Please input the email!' }],
                            })(<Input placeholder="A valid email" />)}
                        </Form.Item>

                        <Form.Item label="Password">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input the password!' }],
                            })(<Input placeholder="A password between 6 to 20 characters" />)}
                        </Form.Item>

                        <Form.Item label="Activated?">
                            {getFieldDecorator('activated', {
                                initialValue: 1,
                            })(<RadioGroup name="radiogroup">
                                <Radio value={1}>Si</Radio>
                                <Radio value={0}>No</Radio>
                            </RadioGroup>)}
                        </Form.Item>
                        <Form.Item label="Role">
                            {getFieldDecorator('rol', {
                                initialValue: "ROLE_USER",
                            })(<Select style={{ width: 120 }} onChange={handleChange}>
                                <Option value="ROLE_USER">User</Option>
                                <Option value="ROLE_MOD">Mod</Option>
                                <Option value="ROLE_ADMIN">Admin</Option>
                            </Select>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

//Modal edit Rol
const EditModal = Form.create({ name: 'form_in_modalEdit' })(
    // eslint-disable-next-line
    class extends React.Component {

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Edit User Role"
                    okText="Save"
                    onCancel={onCancel}
                    onOk={onCreate}>
                    <Form layout="vertical">
                        <Form.Item label="Role">
                            {getFieldDecorator('rol', {
                                initialValue: "ROLE_USER",
                            })(<Select style={{ width: 120 }} onChange={handleChange}>
                                <Option value="ROLE_USER">User</Option>
                                <Option value="ROLE_MOD">Mod</Option>
                                <Option value="ROLE_ADMIN">Admin</Option>
                                <Option value="ROLE_ANONYMOUS">Anonymous</Option>
                            </Select>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

class UserTable extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Username',
                dataIndex: 'login',
                ...this.getColumnSearchProps('login'),
            },
            {
                title: 'Name',
                dataIndex: 'firstName',
                ...this.getColumnSearchProps('firstName'),
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                ...this.getColumnSearchProps('lastName'),
            },
            {
                title: 'Email',
                dataIndex: 'email',
                ...this.getColumnSearchProps('email'),
            },
            {
                title: 'Role',
                dataIndex: 'authorities.[0].name',
                onFilter: (value, record) => record.authorities[0].name === (value),
                filters: [{ text: 'ADMINISTRADOR', value: 'ROLE_ADMIN' }, { text: 'MODERADOR', value: 'ROLE_MOD' },
                { text: 'USUARIO', value: 'ROLE_USER' }, { text: 'ANONIMO', value: 'ROLE_ANONYMOUS' }],
            },
            {
                title: 'Activated',
                dataIndex: 'activated',
                filters: [{ text: 'Si', value: true }, { text: 'No', value: false }],
                render: (text, record) => (
                    <Checkbox checked={record.activated}
                        value={record.activated} />
                ),
                align: "center",
                onFilter: (value, record) => record.activated === value,
            },
            {
                title: 'Created Date',
                dataIndex: 'createdDate',
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (text, record) => (
                    <span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.login)}>
                            <a href="javascript:;">Delete</a>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <a onClick={() => this.showModalEdit(record)} className="ant-dropdown-link">
                            Edit Role
                        </a>
                    </span>),
            },
        ];
        this.state = {
            searchText: '',
            users: [],
            isLoading: false,
            visible: false,
            visibleEditModal: false,
            currentRowEdit: '',
        };
        this.loadUserList = this.loadUserList.bind(this);
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}>
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    // clearAll = () => {
    //     this.setState({ searchText: '' });
    // };

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
            const addUserRequest = {
                login: values.login,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                activated: values.activated,
                authorities: [
                    {
                        name: values.rol,
                    }
                ]
            };
            createUser(addUserRequest)
                .then(response => {
                    notification.success({
                        message: 'Fiscal App',
                        description: "Add user correctly",
                    });
                }).catch(error => {
                    notification.error({
                        message: 'Fiscal App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });
            console.log('Received values of form: ', addUserRequest);
            form.resetFields();
            this.setState({ users: [...this.state.users, addUserRequest] })
            this.setState({ visible: false });
        });
    };

    showModalEdit = record => {
        this.setState({ currentRowEdit: record });
        this.setState({ visibleEditModal: true });
    };

    handleCancelEdit = () => {
        this.setState({ visibleEditModal: false });
    };

    handleEdit = () => {
        const form = this.formRefEdit.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const userEditRole = {
                login: this.state.currentRowEdit.login,
                authorities: [
                    {
                        name: values.rol,
                    }
                ]
            };
            editUser(userEditRole)
                .then(response => {
                    notification.success({
                        message: 'Fiscal App',
                        description: "Edit user correctly",
                    });
                    this.setState({});
                }).catch(error => {
                    notification.error({
                        message: 'Fiscal App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });
            this.setState({ visibleEditModal: false });
            const dataSource = [...this.state.users]
            const pos = dataSource.findIndex(item => item.login === this.state.currentRowEdit.login)
            dataSource[pos].authorities[0].name = values.rol;
            this.setState({ users: dataSource });

        });
    }

    handleDelete = key => {
        const dataSource = [...this.state.users]
        this.setState({ users: dataSource.filter(item => item.login !== key) });
        deleteUser(key)
            .then(response => {
                notification.success({
                    message: 'Fiscal App',
                    description: "You're successfully deleted user",
                });
                this.props.history.push("/");
            })
            .catch(error => {
                notification.error({
                    message: 'Fiscal App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    saveFormRefEdit = formRefEdit => {
        this.formRefEdit = formRefEdit;
    };


    loadUserList() {
        let promise;
        promise = getAllUser();

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const users = this.state.users.slice();
                this.setState({
                    users: users.concat(response),
                    isLoading: false
                })
            }).catch(error => {
                this.setState({
                    isLoading: false
                })
            });
    }

    componentDidMount() {
        this.loadUserList();
    }

    render() {
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div className='table-user'>
                <Button className="button" onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
                    <Icon type="user-add" />
                    Add a new User
                        </Button>
                <Button className="button" onClick={this.clearAll} disabled={true} type="reset" style={{ marginBottom: 16 }}>
                    Reset all Filters
                        </Button>
                <AddModal
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
                <EditModal
                    wrappedComponentRef={this.saveFormRefEdit}
                    visible={this.state.visibleEditModal}
                    onCancel={this.handleCancelEdit}
                    onCreate={this.handleEdit}
                />
                <Table
                    rowKey="login"
                    bordered
                    size="small"
                    columns={columns}
                    dataSource={this.state.users}
                />
            </div>
        );
    }
}

export default UserTable;