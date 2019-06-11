import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import './AppHeader.css';
import FiscalIcon from '../logo.svg';
import { Menu, Dropdown, Icon, Layout, Radio } from 'antd';
const Header = Layout.Header;

function onChange(e) {
  console.log(`radio checked:${e.target.value}`);
}

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick({ key }) {
    if (key === "logout") {
      this.props.onLogout();
    }
  }


  render() {
    let menuItems;
    if (this.props.currentUser) {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" className="nav-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/profile" className="profile-menu">
          <ProfileDropdownMenu
            currentUser={this.props.currentUser}
            handleMenuClick={this.handleMenuClick} />
        </Menu.Item>,
      ];
    } else {
      menuItems = [
        <Menu.Item key="/login">
          <Link to="/login">Login</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link to="/signup">Signup</Link>
        </Menu.Item>,
      ];
    }

    return (
      <Header className="app-header">
        <div className="container">
          <div className="app-title" >
            <img src={FiscalIcon} alt="" className="fiscal-icon" />
            <Link to="/">Fiscal App</Link>
          </div>
          <Menu
            className="app-menu"
            mode="horizontal"
            selectedKeys={[this.props.location.pathname]}
            style={{ lineHeight: '64px' }} >
            {menuItems}
            <Radio.Group onChange={onChange} defaultValue="es">
              <Radio.Button value="es">ES</Radio.Button>
              <Radio.Button value="en">EN</Radio.Button>
            </Radio.Group>
          </Menu>
        </div>
      </Header>
    );
  }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name + " " + props.currentUser.lastname}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/user/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
        <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);