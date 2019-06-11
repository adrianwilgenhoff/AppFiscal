import React, { Component } from 'react';
import { Layout, Menu, Icon, Button } from 'antd';
import './AppNav.css';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class AppNav extends Component {

    state = {
        collapsed: true,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    toggleCollapsed = () => {

        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        let menu;
        if (!this.props.currentUser) {
            menu = null;
        }
        else
            if (this.props.currentUser.authorities[0].authority === 'ROLE_ADMIN') {
                menu = <Sider className="app-sider" style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
                    collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} theme='light'>
                    <div style={{ width: 256 }}>
                        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                        </Button>
                        <Menu
                            defaultSelectedKeys={['0']}
                            defaultOpenKeys={['0']}
                            mode="inline"
                            theme="light"
                            inlineCollapsed={this.state.collapsed}>
                            <Menu.Item key="1">
                                <Link to="/users"></Link>
                                <Icon type="pie-chart" />
                                <span>Usuarios</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="desktop" />
                                <span>Escuelas</span>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Icon type="inbox" />
                                <span>Fiscales Generales</span>
                            </Menu.Item>
                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
                                        <Icon type="mail" />
                                        <span>Fiscales</span>
                                    </span>}>
                                <Menu.Item key="5">Buscar</Menu.Item>
                                <Menu.Item key="6">Listar</Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="sub2"
                                title={
                                    <span>
                                        <Icon type="appstore" />
                                        <span>Navigation Fiscales</span>
                                    </span>
                                }>
                                <Menu.Item key="9">Fiscales</Menu.Item>
                                <Menu.Item key="10">Fiscales Generales</Menu.Item>
                                <SubMenu key="sub3" title="Submenu">
                                    <Menu.Item key="11">Option 11</Menu.Item>
                                    <Menu.Item key="12">Option 12</Menu.Item>
                                </SubMenu>
                            </SubMenu>
                        </Menu>
                    </div>
                </Sider>
            }
            else {
                menu = <Sider className="app-sider" style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
                    collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} theme='light'>
                    <div style={{ width: 256 }}>
                        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                        </Button>
                        <Menu
                            mode="inline"
                            theme="light"
                            inlineCollapsed={this.state.collapsed}>
                            <Menu.Item key="1">
                                <Icon type="pie-chart" />
                                <span>Escuelas</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="desktop" />
                                <span>Fiscales</span>
                            </Menu.Item>
                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
                                        <Icon type="mail" />
                                        <span>Navigation One</span>
                                    </span>}>
                                <Menu.Item key="5">Option 5</Menu.Item>
                                <Menu.Item key="6">Option 6</Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="sub2"
                                title={
                                    <span>
                                        <Icon type="appstore" />
                                        <span>Navigation Two</span>
                                    </span>
                                }>
                                <Menu.Item key="9">Option 9</Menu.Item>
                                <Menu.Item key="10">Option 10</Menu.Item>
                                <SubMenu key="sub3" title="Submenu">
                                    <Menu.Item key="11">Option 11</Menu.Item>
                                    <Menu.Item key="12">Option 12</Menu.Item>
                                </SubMenu>
                            </SubMenu>
                        </Menu>
                    </div>
                </Sider>
            }
        return (
            menu
        );
    }
}
export default AppNav;
