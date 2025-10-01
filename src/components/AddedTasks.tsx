import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

type AddedTasksProps = {
    task: {id: string, name:string, isDone:boolean}, 
 
}

export const AddedTasks = ({task, delete, edit, update}:AddedTasksProps) => {
  return (
    <div>
      <div
        key={task.id}
        className="card border border-base-300 p-4 mt-2 flex-row justify-between"
      >
        <div className="flex gap-2 items-center">
          <input
            checked={task.isDone}
            type="checkbox"
            onClick={update}
          />
          <div className={`${task.isDone && "line-through"}`}>{task.name}</div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className={`btn btn-ghost btn-square ${task.isDone && "hidden"}`}
            onClick={edit}
          >
            <CiEdit size={28} />
          </button>
          <button
            className="btn btn-error btn-soft btn-square"
            onClick={delete}
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
