import React from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class AccountMenu extends React.Component {
  constructor({props}) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Menu
        onClick={this.props.handleViewSelection}
        style={{ width: 240 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <Menu.Item key="account">View/Edit Account Information</Menu.Item>
        <Menu.Item key="profile">View/Edit Profile</Menu.Item>
        <Menu.Item key="history">Your Kindred History</Menu.Item>
        <Menu.Item key="messages">Messages With Kin</Menu.Item>
      </Menu>
    );
  }
}
