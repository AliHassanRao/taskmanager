import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, DatePicker, Select, Button, Typography, Spin, message } from 'antd';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';
import dayjs from 'dayjs'; // For date handling

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? 'add' : 'update';
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === 'add' ? 'Add Task' : 'Update Task';
  }, [mode]);

  useEffect(() => {
    if (mode === 'update') {
      const config = { url: `/tasks/${taskId}`, method: 'get', headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          title: data.task.title,
          description: data.task.description,
          dueDate: dayjs(data.task.dueDate), // Convert to dayjs object for DatePicker
          status: data.task.status,
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date,
    });
  };

  const handleStatusChange = (value) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleReset = () => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: dayjs(task.dueDate),
      status: task.status,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('task', formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const payload = {
      ...formData,
      dueDate: formData.dueDate.toISOString(), // Convert dayjs object to ISO string
    };

    if (mode === 'add') {
      const config = { url: '/tasks', method: 'post', data: payload, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
    
        navigate('/');
      });
    } else {
      const config = { url: `/tasks/${taskId}`, method: 'put', data: payload, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        message.success('Task updated successfully!');
        navigate('/');
      });
    }
  };



  return (
    <MainLayout>
      <div style={{ maxWidth: '1000px', margin: '64px auto', padding: '24px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        {loading ? (
          <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }} />
        ) : (
          <>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
              {mode === 'add' ? 'Add New Task' : 'Edit Task'}
            </Title>

            <Form layout="vertical">
              {/* Title Field */}
              <Form.Item
                label="Title"
                required
                validateStatus={formErrors.title ? 'error' : ''}
                help={formErrors.title}
              >
                <Input
                  name="title"
                  value={formData.title}
                  placeholder="Enter task title"
                  onChange={handleChange}
                />
              </Form.Item>

              {/* Description Field */}
              <Form.Item
                label="Description"
                required
                validateStatus={formErrors.description ? 'error' : ''}
                help={formErrors.description}
              >
                <TextArea
                  name="description"
                  value={formData.description}
                  placeholder="Write task description here.."
                  onChange={handleChange}
                  rows={4}
                />
              </Form.Item>

              {/* Due Date Field */}
              <Form.Item
                label="Due Date"
                required
                validateStatus={formErrors.dueDate ? 'error' : ''}
                help={formErrors.dueDate}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  value={formData.dueDate}
                  onChange={handleDateChange}
                />
              </Form.Item>

              {/* Status Field */}
              <Form.Item
                label="Status"
                required
                validateStatus={formErrors.status ? 'error' : ''}
                help={formErrors.status}
              >
                <Select
                  value={formData.status}
                  onChange={handleStatusChange}
                  style={{ width: '100%' }}
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>

              {/* Buttons */}
              <Form.Item>
                <Button  onClick={handleSubmit}>
                  {mode === 'add' ? 'Add Task' : 'Update Task'}
                </Button>
                <Button style={{ marginLeft: '8px' }} onClick={() => navigate('/')}>
                  Cancel
                </Button>
                {mode === 'update' && (
                  <Button style={{ marginLeft: '8px' }} onClick={handleReset}>
                    Reset
                  </Button>
                )}
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Task;