"use client";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<{ id: string; name: string }[]>([]);
  // console.log(newTask, "newTask");
  // console.log(tasks, "tasks");

  async function createNewTask() {
    newTask !== "" &&
      (await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTask }),
      }));
    loadTasks();
    setNewTask("");
  }

  function loadTasks() {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }

  function deleteTask(id: string) {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      loadTasks();
    });

    // .then((res) => {})
    // .then((data) => {})
    // .catch((error) => {});
  }
  useEffect(() => {
    loadTasks();
  }, []);
  return (
    <div className="flex justify-center mt-10">
      <div className="card w-96 bg-base-100 card-lg shadow-lg">
        <div className="card-body">
          <h2 className="card-title">To-Do</h2>
          <div className="flex">
            <input
              className="input mr-4"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key == "Enter" && createNewTask()}
            />
            <button onClick={createNewTask} className="btn">
              Add
            </button>
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="card border border-base-300 p-2 mt-2 flex flex-row justify-between"
            >
              <div>
                {task.name} {task.id}
              </div>
              <button onClick={() => deleteTask(task.id)}>X</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
