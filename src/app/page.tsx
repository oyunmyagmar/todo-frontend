"use client";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { BsPlusLg } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

type Task = { id: string; name: string; isDone: boolean };

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [status, setStatus] = useState("All");

  useEffect(() => {
    loadTasks();
  }, [status]);

  const STATUS_LABELS: Record<string, string> = {
    All: "All Tasks",
    Active: "Active Tasks",
    Completed: "Completed Tasks",
  };
  async function createNewTask() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newTask }),
    });
    loadTasks();
    setNewTask("");
  }

  async function loadTasks() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks?status=${status}`
    );
    const data = await res.json();

    setTasks(data.tasks);
    setTotalTasks(data.total);
  }

  async function deleteTask(id: string) {
    if (confirm("Delete this task?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      loadTasks();
    }
  }

  async function editTask(task: Task) {
    const newName = prompt("Edit", task.name);
    if (newName) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      loadTasks();
    }
  }

  async function toggleCheckBox(id: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}/check`, {
      method: "PATCH",
    });
    loadTasks();
  }

  async function deleteAllCompleted() {
    if (!confirm("Delete all completed tasks?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/completed`, {
      method: "DELETE",
    });

    loadTasks();
  }

  return (
    <div className="w-screen h-full flex justify-center items-center">
      <div className="card w-150 bg-gray-400/10 shadow-2xl m-5">
        <div className="card-body">
          <h2 className="card-title">To-Do</h2>
          <div className="w-full flex">
            <input
              type="text"
              placeholder="Add a task..."
              className="input mr-4 flex-1"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key == "Enter" && createNewTask()}
            />
            <button
              disabled={!newTask}
              onClick={createNewTask}
              className="btn btn-info btn-soft rounded-xs"
            >
              <BsPlusLg size={26} />
            </button>
          </div>

          <div role="tablist" className="tabs tabs-box mt-2">
            {["All", "Active", "Completed"].map((el) => (
              <a
                key={el}
                role="tab"
                className={`tab flex-1 ${status === el ? "tab-active" : ""}`}
                onClick={() => setStatus(el)}
              >
                {el}
              </a>
            ))}
          </div>

          {tasks.map((task) => (
            <div
              key={task.id}
              className={`card border border-base-300 p-4 mt-2 flex-row justify-between`}
            >
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  onChange={() => toggleCheckBox(task.id)}
                  defaultChecked={task.isDone}
                  className="checkbox checkbox-success checkbox-xs rounded-xs"
                />

                <div className={`${task.isDone && "line-through"} flex-1`}>
                  {task.name}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  className={`btn btn-ghost btn-square ${
                    task.isDone && "hidden"
                  } rounded-xs`}
                  onClick={() => editTask(task)}
                >
                  <CiEdit size={28} />
                </button>

                <button
                  className="btn btn-error btn-soft btn-square rounded-xs"
                  onClick={() => deleteTask(task.id)}
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </div>
          ))}
          <p className="flex gap-0.5">
            <span>{STATUS_LABELS[status]}:</span>
            <span className="font-semibold">{tasks.length}</span>
            <span>/{totalTasks}</span>
          </p>
          <button
            className="btn mt-2 cursor-pointer"
            onClick={deleteAllCompleted}
          >
            Clear All Completed Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
export default Home;
