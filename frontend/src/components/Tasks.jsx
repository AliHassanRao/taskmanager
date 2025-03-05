import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button, Typography, Tooltip, Spin, Empty, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useFetch from '../hooks/useFetch';
import dayjs from 'dayjs'; // For date formatting

const { Title } = Typography;

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  // Fetch all tasks
  const fetchTasks = useCallback(() => {
    const config = { url: '/tasks', method: 'get', headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then((data) => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  // Handle task deletion
  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: 'delete', headers: { Authorization: authState.token } };
    fetchData(config).then(() => {
      message.success('Task deleted successfully!');
      fetchTasks();
    });
  };

  // Handle marking a task as completed
  const handleMarkAsCompleted = (id) => {
    const taskToUpdate = tasks.find((task) => task._id === id);

    if (!taskToUpdate) {
      message.error('Task not found!');
      return;
    }

    const updatedTask = {
      ...taskToUpdate,
      status: 'Completed',
    };

    const config = {
      url: `/tasks/${id}`,
      method: 'put',
      headers: { Authorization: authState.token },
      data: updatedTask,
    };

    fetchData(config).then(() => {
      message.success('Task marked as completed!');
      fetchTasks();
    });
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  // Table columns
  const columns = [
    {
      title: 'Task #',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => dayjs(dueDate).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, task) => (
        <Space>
          <Tooltip title="Edit this task">
            <Link to={`/tasks/${task._id}`}>
              <Button type="link" icon={<EditOutlined />} />
            </Link>
          </Tooltip>

          {task.status !== 'Completed' && (
            <Tooltip title="Mark as completed">
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleMarkAsCompleted(task._id)}
              />
            </Tooltip>
          )}

          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(task._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>
          {tasks.length === 0 ? 'You do not have any tasks' : 'Your Tasks'}
        </Title>
        <Link to="/tasks/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Task
          </Button>
        </Link>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }} />
      ) : tasks.length === 0 ? (
        <Empty
          description="No tasks found"
          style={{ margin: '64px 0' }}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Table
                  dataSource={tasks}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  bordered
                  components={{
                    body: {
                      row: (props) => {
                        const index = tasks.findIndex((task) => task._id === props['data-row-key']);
                        return (
                          <Draggable draggableId={props['data-row-key']} index={index}>
                            {(provided) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                {...props}
                              />
                            )}
                          </Draggable>
                        );
                      },
                    },
                  }}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default Tasks;