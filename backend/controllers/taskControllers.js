const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ tasks, status: true, msg: "Tasks found successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Get a single task by ID
exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found.." });
    }
    res.status(200).json({ task, status: true, msg: "Task found successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Create a new task
exports.postTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate) {
      return res.status(400).json({ status: false, msg: "Title, description, and due date are required" });
    }

    // Create the task
    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      dueDate,
      status: status || "Pending", // Default status is "To Do"
    });

    res.status(200).json({ task, status: true, msg: "Task created successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Update a task
exports.putTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !status) {
      return res.status(400).json({ status: false, msg: "Title, description, due date, and status are required" });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    // Check if the task belongs to the logged-in user
    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't update task of another user" });
    }

    // Update the task
    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, dueDate, status },
      { new: true }
    );

    res.status(200).json({ task, status: true, msg: "Task updated successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    // Check if the task belongs to the logged-in user
    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't delete task of another user" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

exports.getFilteredTasks = async (req, res) => {
  try {
    const { status } = req.query;

    // Validate status
    if (!status) {
      return res.status(400).json({ status: false, msg: "Status query parameter is required" });
    }

    // Find tasks with the specified status
    const tasks = await Task.find({ user: req.user.id, status });

    if (tasks.length === 0) {
      return res.status(200).json({ tasks, status: true, msg: "No tasks found with the specified status" });
    }

    res.status(200).json({ tasks, status: true, msg: "Filtered tasks found successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};