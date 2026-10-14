import { useState,useEffect } from "react";
import "./App.css";

function App() {

  const [list, setList] = useState(() => {
  const savedList = localStorage.getItem("todos");
  return savedList ? JSON.parse(savedList) : [];
});
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editindex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(list));
}, [list]);

 function Add() {
  const alreadyExists = list.some(
    (value) => value.task.trim().toLowerCase() === input.trim().toLowerCase()
  );

  if (alreadyExists) {
    setError("Task already exists!");
    return;
  }
  setError("");
  setList([...list,{task: input,deadline: deadline }]);
  setInput("");
  setDeadline("");
}

function CompleteTask(index) {
  const newList = [...list];
  newList[index].completed = true;
  setList(newList);
  setNotification(` Task completed: ${newList[index].task}`);
   setTimeout(() => {
    setNotification("");
  }, 2000);
}
  function Delete(index) {
    const newList = list.filter((value, i) => i !== index);
    setList(newList);
    alert("delete?")
  }
  function Edit(index) {
    setInput(list[index].task);
    setDeadline(list[index].deadline);
    setEditIndex(index);
  }
  function Update() {
    const newList = [...list];
    newList[editindex] = {task: input,deadline: deadline,completed: list[editindex].completed };
    setList(newList);
    setInput("");
    setDeadline("");
    setEditIndex(null);
  }
useEffect(() => {
  const timer = setInterval(() => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const now = `${hours}:${minutes}`;
    list.forEach((value) => {
      if (value.deadline === now && !value.completed) {
        setNotification(`Time over Man: ${value.task}`);
      }
    });
  }, 1000);
  return () => clearInterval(timer);
}, [list]);
  return (
    <div className="container">
      <h1>My ToDo List</h1>
{error && <p>{error}</p>}
{notification && <p>{notification}</p>}
      <div className="input-box">
        <input type="text"value={input}onChange={(e) => setInput(e.target.value)} />
        <input type="time"value={deadline}onChange={(e) => setDeadline(e.target.value)} />
        {editindex === null ? (
          <button className="add-btn" onClick={Add}> Add</button>) : (<button className="add-btn" onClick={Update}>Update </button> )}
      </div>
      <div className="todo-list">
        {list.map((value, index) => {
          return (
            <div className="todo-item" key={index}>
              <input type="checkbox"checked={value.completed || false} onChange={() => CompleteTask(index)}/>
              <p>{value.task}</p>

              <span>Deadline: {value.deadline}</span>
              <div className="actions">
                <button className="edit-btn"onClick={() => Edit(index)}>Edit  </button>
              <button className="delete-btn"onClick={() => Delete(index)}>Delete </button>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;