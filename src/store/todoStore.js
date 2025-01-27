import { toast } from "react-toastify";
import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (filters) => {
    set({ loading: true });
    console.log("Filters:", filters);
    try {
      // Construct the query string based on the filters object
      let queryString = "?";
      if (filters.status) queryString += `status=${filters.status}&`;
      if (filters.priority) queryString += `priority=${filters.priority}&`;

      // Remove the trailing '&' if there is one
      queryString = queryString.endsWith("&")
        ? queryString.slice(0, -1)
        : queryString;

      // Fetch tasks with the query parameters
      const response = await fetch(
        `https://todo-be-rouge.vercel.app/todo${queryString}`
      );
      console.log(response);
      const data = await response.json();
      console.log(data.data);

      set({ tasks: data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    set({ loading: true });
    try {
      console.log(taskData);
      const response = await fetch(`https://todo-be-rouge.vercel.app/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const newTask = await response.json();
      set((state) => ({
        tasks: [...state.tasks, newTask],
        loading: false,
      }));
      toast.success(newTask.message);
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message, loading: false });
    }
  },

  // Update an existing task
  updateTask: async (taskId, updatedData) => {
    set({ loading: true });
    try {
      const response = await fetch(`https://todo-be-rouge.vercel.app/todo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: taskId, ...updatedData }),
      });
      const updatedTask = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
        loading: false,
      }));
      toast.success(updatedTask.message);
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message, loading: false });
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    set({ loading: true });
    try {
      await fetch(`https://todo-be-rouge.vercel.app/todo`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: taskId }),
      });
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        loading: false,
      }));
      toast.success("Deleted");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
    }
  },
}));

export { useTaskStore };
