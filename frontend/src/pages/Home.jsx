import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Typography, Button, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn, user } = authState;

  useEffect(() => {
    document.title = isLoggedIn ? `${user.name}'s tasks` : 'Task Manager';
  }, [isLoggedIn, user]);

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        {!isLoggedIn ? (
          <div
            style={{
              background: '#1890ff',
              color: '#fff',
              height: '40vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px',
            }}
          >
            <Title level={2} style={{ color: '#fff', marginBottom: '16px' }}>
              Welcome to Task Manager App
            </Title>
            <Link to="/signup">
              <Button type="primary" size="large">
                <Space>
                  <Text strong style={{ color: '#fff' }}>
                    Join now to manage your tasks
                  </Text>
                  <ArrowRightOutlined />
                </Space>
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <Title level={3} style={{ margin: '24px 0', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
              Welcome, {user.name}
            </Title>
            <Tasks />
          </>
        )}
      </Content>
    </MainLayout>
  );
};

export default Home;