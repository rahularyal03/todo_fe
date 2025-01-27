import React from "react";
import "./App.css";
import TaskList from "./components/TodoPage";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <TaskList />
      <ToastContainer />
    </>
  );
}

export default App;
