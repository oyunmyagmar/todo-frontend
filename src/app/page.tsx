"use client";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { BsPlusLg } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { SideBar } from "@/components";
// import { AddedTasks } from "@/components";

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<
    { id: string; name: string; isDone: boolean }[]
  >([]);
  // console.log(newTask, "newTask");
  // console.log(tasks, "tasks");
  // const [filteredStatus, setFilteredStatus] = useState("All");
  // console.log(filteredStatus, "filteredStatus");

  async function createNewTask() {
    // setFilteredStatus("Active");
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
    // setFilteredStatus("Completed");
    await fetch(`http://localhost:3000/check/tasks/${id}`, {
      method: "PUT",
    });
    loadTasks();
  }

  // async function filterTasks(btn: string) {
  //   // setFilteredStatus(btn);

  //   await fetch(`http://localhost:3000/tasks/${btn}`, {
  //     method: "PUT",
  //   });
  //   loadTasks();
  // }

  useEffect(() => {
    loadTasks();
  }, []);
  const filterBtn = ["All", "Active", "Completed"];

  return (
    <div className="w-screen h-screen flex bg-gray-100">
      {/* <div className="w-100 h-screen bg-white px-5 ">
        <h1>Sidebar</h1> */}
      {/* {filterBtn.map((btn) => (
          <button className="btn w-full" onClick={() => filterTasks(btn)}>
            {btn}
          </button>
        ))} */}
      {/* </div> */}
      <div className="mx-10">
        <button className="btn">
          <RxHamburgerMenu />
        </button>
        <div className="card w-full bg-base-100 card-lg shadow-lg mt-10">
          <div className="card-body">
            <h2 className="card-title">To-Do</h2>
            <div className="w-full flex">
              <input
                type="text"
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
              // <AddedTasks
              //   task={task}
              //   delete={() => deleteTask(task.id)}
              //   edit={() => editTask(task)}
              //   update={() => updateTask(task.id)}
              // />
              <div
                key={task.id}
                className={`card border border-base-300 p-4 mt-2 flex-row justify-between ${
                  task.isDone && "hidden"
                }`}
              >
                <div className="w-70 flex gap-2 items-center">
                  <input
                    checked={task.isDone}
                    type="checkbox"
                    onChange={() => updateTask(task.id)}
                    className="accent-blue-300"
                  />
                  <div className={`${task.isDone && "line-through"} truncate`}>
                    {task.name}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className={`btn btn-ghost btn-square ${
                      task.isDone && "hidden"
                    }`}
                    onClick={() => editTask(task)}
                  >
                    <CiEdit size={28} />
                  </button>
                  <button
                    className="btn btn-error btn-soft btn-square hover:"
                    onClick={() => deleteTask(task.id)}
                  >
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              </div>
            ))}
            <div>
              <button
                className={`btn btn-neutral ${tasks.map((task) =>
                  task.isDone ? "block" : "hidden"
                )}`}
              >
                Completed {tasks.filter((el) => el.isDone).length} out of{" "}
                {tasks.length}
              </button>
              {tasks.map(
                (task) =>
                  task.isDone && (
                    <div
                      key={task.id}
                      className="card border border-base-300 p-4 mt-2 flex-row justify-between"
                    >
                      <div className="w-70 flex gap-2 items-center">
                        <input
                          checked={task.isDone}
                          type="checkbox"
                          onChange={() => updateTask(task.id)}
                        />
                        <div
                          className={`${
                            task.isDone && "line-through"
                          } truncate`}
                        >
                          {task.name}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          className={`btn btn-ghost btn-square ${
                            task.isDone && "hidden"
                          }`}
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
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
