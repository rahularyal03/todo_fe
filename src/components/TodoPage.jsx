import React, { useState, useEffect } from "react";
import { useTaskStore } from "../store/todoStore";
import "./todo.css"; // Import external CSS file

const TaskList = () => {
  const { tasks, loading, fetchTasks, deleteTask, createTask, updateTask } =
    useTaskStore();
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  // Handle input changes for new task or edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const { title, description } = newTask;

    if (!title.trim() || !description.trim()) {
      return alert("Title and description are required!");
    }

    await createTask(newTask);
    setNewTask({ title: "", description: "", priority: "Low" });
    fetchTasks(filters);
  };

  // Handle updating a task
  const handleEditTask = async (e) => {
    e.preventDefault();

    if (!editingTask.title.trim() || !editingTask.description.trim()) {
      return alert("Title and description are required!");
    }

    await updateTask(editingTask._id, editingTask);
    setEditingTask(null);
    fetchTasks(filters);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="task-container">
      <h2 className="header">Task Manager</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <label>
          Status:
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        <label>
          Priority:
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="form">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleInputChange}
          className="input"
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleInputChange}
          className="textarea"
          required
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleInputChange}
          className="select"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" className="button add-button">
          Add Task
        </button>
      </form>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks available.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-details">
                <strong>{task.title}</strong> - {task.description} (
                {task.priority})
              </div>
              <div className="task-actions">
                <button
                  className="edit-button"
                  onClick={() => setEditingTask(task)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    deleteTask(task._id);
                    fetchTasks(filters);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal">
          <form onSubmit={handleEditTask} className="modal-form">
            <h3>Edit Task</h3>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={editingTask.title}
              onChange={handleInputChange}
              className="input"
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={editingTask.description}
              onChange={handleInputChange}
              className="textarea"
              required
            />
            <select
              name="priority"
              value={editingTask.priority}
              onChange={handleInputChange}
              className="select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div>
              <button type="submit" className="button save-button">
                Save Changes
              </button>
              <button
                type="button"
                className="button cancel-button"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskList;
