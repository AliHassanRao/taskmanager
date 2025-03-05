import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Spin, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import validateManyFields from '../validations';
import { postLoginData } from '../redux/actions/authActions';

const { Title } = Typography;

const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const authState = useSelector((state) => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || '/');
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('login', formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  };

 

  return (
    <div style={{ maxWidth: '500px', margin: '64px auto', padding: '24px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }} />
      ) : (
        <>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Login Here
          </Title>

          <Form layout="vertical">
            {/* Email Field */}
            <Form.Item
              label="Email"
              required
              validateStatus={formErrors.email ? 'error' : ''}
              help={formErrors.email}
            >
              <Input
                name="email"
                value={formData.email}
                placeholder="youremail@domain.com"
                onChange={handleChange}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label="Password"
              required
              validateStatus={formErrors.password ? 'error' : ''}
              help={formErrors.password}
            >
              <Input.Password
                name="password"
                value={formData.password}
                placeholder="Your password.."
                onChange={handleChange}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  backgroundColor: '#1890ff', // Primary color
                  borderColor: '#1890ff', // Primary color
                  color: '#fff', // Text color
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/signup" style={{ color: '#40a9ff' }}>
              Don't have an account? Signup here
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm;