"use client";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { BsPlusLg } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<
    { id: string; name: string; isDone: boolean }[]
  >([]);
  // console.log(newTask, "newTask");
  // console.log(tasks, "tasks");

  async function createNewTask() {
    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newTask }),
    });
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

  async function deleteTask(id: string) {
    // console.log("delete ajilaa");
    // alert(id);
    if (confirm("Are you sure you want to delete this task?")) {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });
      loadTasks();
    }
  }

  async function editTask(task: { id: string; name: string }) {
    const newName = prompt("Edit", task.name);
    if (newName) {
      await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      loadTasks();
    }
  }

  async function updateTask(id: string) {
    await fetch(`http://localhost:3000/check/tasks/${id}`, {
      method: "PUT",
    });
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <div className="card w-150 bg-base-100 card-lg shadow-lg">
        <div className="card-body">
          <h2 className="card-title">To-Do</h2>
          <div className="w-full flex">
            <input
              placeholder="Add a task..."
              className="input mr-4 w-full"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key == "Enter" && createNewTask()}
            />
            <button
              disabled={!newTask}
              onClick={createNewTask}
              className="btn btn-info btn-soft"
            >
              <BsPlusLg size={26} />
            </button>
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="card border border-base-300 p-4 mt-2 flex-row justify-between"
            >
              <div className="flex gap-2 items-center">
                <input
                  checked={task.isDone}
                  type="checkbox"
                  onClick={() => updateTask(task.id)}
                />
                <div className={`${task.isDone && "line-through"}`}>
                  {task.name}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  className="btn btn-ghost btn-square"
                  onClick={() => editTask(task)}
                >
                  <CiEdit size={28} />
                </button>
                <button
                  className="btn btn-error btn-soft btn-square"
                  onClick={() => deleteTask(task.id)}
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </div>
          ))}
          <div>
            <button className="btn btn-neutral">Completed</button>

            {tasks.map((task) => task.isDone && <div>{task.name}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
