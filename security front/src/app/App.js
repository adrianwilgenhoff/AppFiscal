import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import { Layout, notification, Icon } from 'antd';
import AppNav from '../common/AppNav';
import PrivateRoute from '../common/PrivateRoute';
import UserTable from '../common/UserTable';
import ResetPassword from '../user/login/ResetPassword';
import ActivationForm from '../user/login/ActivationForm';
import ChangePassword from '../user/login/ChangePassword';
import ResetPasswordOK from '../user/login/ResetPasswordOK';

const { Footer, Content } = Layout;

class App extends Component {

  //_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  state = {
    collapsed: false,
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

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    // this._isMounted = true;
    // if (this._isMounted) {
    //   this.loadCurrentUser();
    // }
    this.loadCurrentUser();
  }

  // componentWillUnmount() {
  //   this._isMounted = false;
  // }

  handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'Fiscal App',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Fiscal App',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
      <div>
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
            onLogout={this.handleLogout} />
          <Layout>
            <AppNav isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser} />
            <Content style={{ padding: '0 24px', minHeight: 500 }} className="app-content">
              <Switch>
                <Route exact path="/">
                </Route>
                <Route path="/login"
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}>
                </Route>
                <Route path="/reset-password-ok" component={ResetPasswordOK}></Route>>
                <Route path="/reset-password" component={ResetPassword}></Route>
                <Route path="/activate/ok" component={ActivationForm}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/user/:username/change-password"
                  render={(props) => <ChangePassword isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}>
                </Route>
                <Route path="/user/:username"
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}>
                </Route>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/users" component={UserTable} handleLogout={this.handleLogout}></PrivateRoute>
                <Route component={NotFound}></Route>
              </Switch>
            </Content>
          </Layout>
        </Layout >
        <Footer style={{ textAlign: 'center' }} className="app-footer">
          Fiscal App ©2019 Created by Adrian E. Wilgenhoff
          <br></br>
          <a href="https://github.com/adrianwilgenhoff" target="_blank" rel="noopener noreferrer">
            <Icon type="github" style={{ fontSize: '16px' }} />
          </a>
          <a href="https://www.linkedin.com/in/adrian-wilgenhoff/" target="_blank" rel="noopener noreferrer">
            <Icon type="linkedin" style={{ fontSize: '16px' }} />
          </a>
          <a href="https://www.facebook.com/adrianezequiel.wilgenhoff" target="_blank" rel="noopener noreferrer">
            <Icon type="facebook" style={{ fontSize: '16px' }} />
          </a>
          <a href="mailto:adrianwilgenhoff@gmail.com" target="_blank" rel="noopener noreferrer">
            <Icon type="mail" style={{ fontSize: '16px' }} />
          </a>
        </Footer>
      </div>
    );
  }
}

export default withRouter(App);
