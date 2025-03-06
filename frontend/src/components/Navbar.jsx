import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import { Layout, Menu, Button, Space, Drawer, Typography } from 'antd';
import {
  PlusOutlined,
  LogoutOutlined,
  LoginOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Title level={3} style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>Task Manager</Link>
        </Title>

        {/* Desktop Navbar */}
        <Space size="middle" className="desktop-menu" style={{ display: 'flex' }}>
          {authState.isLoggedIn ? (
            <>
             
              <Button type="default" icon={<LogoutOutlined />} onClick={handleLogoutClick} danger>
                Logout
              </Button>
            </>
          ) : (
            <Button type="primary" icon={<LoginOutlined />}>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </Space>

        {/* Mobile Navbar Toggle Button */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: '18px' }} />}
          onClick={toggleNavbar}
          className="mobile-menu-btn"
          style={{ display: 'none' }}
        />
      </div>

      {/* Mobile Navbar (Drawer) */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={toggleNavbar}
        open={isNavbarOpen}
        width={300}
        extra={<Button type="text" icon={<CloseOutlined />} onClick={toggleNavbar} />}
      >
        <Menu mode="vertical" selectable={false}>
          {authState.isLoggedIn ? (
            <>
              <Menu.Item key="add-task" icon={<PlusOutlined />}>
                <Link to="/tasks/add">Add Task</Link>
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogoutClick} danger>
                Logout
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login" icon={<LoginOutlined />}>
              <Link to="/login">Login</Link>
            </Menu.Item>
          )}
        </Menu>
      </Drawer>
    </Header>
  );
};

export default Navbar;
