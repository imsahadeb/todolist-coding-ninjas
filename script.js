// This audio file will be use when we perform any operation to DB
const Sound = new Audio("audio.wav");
document.addEventListener("load", () => {
  /* It loads the UI when the page reloads*/
  getItems();
});

/* 

Basic Structure of our db object in local storage
*********************************************
db={
  id:"id",
  todoText:'text',
  status:'completed'

}   */

//Checks the number of todolist stored in local
//storage
function getTaskLength() {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  return db.length;
}

// Checks total active task
function getActiveTaskLength() {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let activeItems = db.filter((item) => item.status === "active");

  return activeItems.length;
}

// Get the todo list from local storage and render in UI with the help of generateItems() function.
function getItems() {
  // This will loads the 'todoList' object from database .
  // If there is no db in local storage then it will assign a empty array
  // later stage it will update db with object 'todoList' with addItems() funtion.
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  console.log("All items: ", db);
  if (db.length > 0) {
    let activeItems = db.filter((item) => item.status === "active");
    console.log("Active items: ", activeItems);
    generateItems(activeItems, "active");
    let completedItems = db.filter((item) => item.status === "completed");
    console.log("Completed items: ", completedItems);
    generateItems(completedItems, "completed");
  }
  updateTask();
}

/*
generateItems(param,param), is the main function which take cares for creating HTML element 
according to available todo list in local storage.

It takes two parameter, one is @items and other is @status. @items is actualy an array instance
of local data storage and @status takes care whether the it is 'completed' or 'active' todo list. 

*/
function generateItems(items, status) {
  let todoContainer = document.querySelector("#todo-items");
  // let todoContainer = document.getElementById("todo-container");
  if (status === "active") {
    todoContainer.innerHTML = "";
  }
  items.forEach((item) => {
    let todoItem = document.createElement("div");
    todoItem.dataset.itemId = item.id;
    todoItem.classList.add("todo-item");

    let left = document.createElement("div");
    left.classList.add("left");

    let check = document.createElement("div");
    check.classList.add("check");
    if (item.status === "completed") {
      check.classList.add("checked");
    }

    let checkMark = document.createElement("div");
    checkMark.classList.add("check-mark");
    if (item.status === "completed") {
      checkMark.classList.add("checked");
    }
    checkMark.addEventListener("click", function () {
      toggleCheckClass(checkMark);
    });

    checkMark.innerHTML = '<i class="fa-solid fa-check"></i>';
    check.appendChild(checkMark);

    let todoTextElm = document.createElement("div");
    todoTextElm.classList.add("todo-text");
    if (item.status === "completed") {
      todoTextElm.classList.add("checked");
    }

    let todoInput = document.createElement("input");
    todoInput.classList.add("text");
    todoInput.type = "text";
    todoInput.value = item.todoText;
    todoInput.setAttribute("readonly", "readonly");

    todoTextElm.appendChild(todoInput);

    left.appendChild(check);
    left.appendChild(todoTextElm);

    let right = document.createElement("div");
    right.classList.add("right");

    let edit = document.createElement("div");
    edit.classList.add("edit");
    if (item.status === "completed") {
      edit.classList.add("hide");
    }
    edit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    let del = document.createElement("div");
    del.classList.add("del");
    del.innerHTML = '<i class="fa-solid fa-trash"></i>';
    del.addEventListener("click", function (event) {
      removeTodo(event.target);
    });

    edit.addEventListener("click", (e) => {
      editTodo(e.target);
    });

    right.appendChild(edit);
    right.appendChild(del);

    todoItem.appendChild(left);
    todoItem.appendChild(right);

    // Appending complete task to the end of UI
    if (status === "active") {
      // Active item in top of UI
      todoContainer.insertBefore(todoItem, todoContainer.firstChild);
    } else {
      todoContainer.appendChild(todoItem);
    }
  });
}

// This updateTask() function takes care to update number of task remaining in databse including active, completed.
// and update in the UI.
function updateTask() {
  let totalTasks = getTaskLength();
  let activeTask = getActiveTaskLength();

  console.log("Update Task Called: ", totalTasks);

  const total = document.querySelector(".items-left");
  const activeT = document.querySelector(".activeT");
  const completedT = document.querySelector(".completedT");

  total.innerText = `Task (${totalTasks})`;
  activeT.innerText = `Active (${activeTask})`;
  completedT.innerText = `Completed (${totalTasks - activeTask})`;
}

// removeChecked() removes completed task
function removeChecked() {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach(function (item) {
    let itemId = item.dataset.itemId;
    let checkMark = item.querySelector(".check-mark");
    if (checkMark.classList.contains("checked")) {
      db = db.filter((i) => i.id !== itemId);
      item.remove();
    }
  });
  localStorage.setItem("todoList", JSON.stringify(db));
  updateTask();
}

// toggleCheckClass()  marks element active to completed and vice versa
function toggleCheckClass(element) {
  element.classList.toggle("checked");
  const todoText = element.closest(".todo-item").querySelector(".todo-text");
  if (element.classList.contains("checked")) {
    todoText.classList.add("checked");
    Sound.play();
  } else {
    todoText.classList.remove("checked");
    Sound.play();
  }

  let itemId = element.closest(".todo-item").dataset.itemId;
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let itemIndex = db.findIndex((i) => i.id === itemId);
  if (itemIndex !== -1) {
    db[itemIndex].status =
      db[itemIndex].status === "active" ? "completed" : "active";
    localStorage.setItem("todoList", JSON.stringify(db));
    getItems();
  }
}

// removeTodo() removes the perticular todolisr form the todo
function removeTodo(delButton) {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let todoItem = delButton.closest(".todo-item");
  let itemId = todoItem.dataset.itemId;
  db = db.filter((item) => item.id !== itemId);
  console.log("inside db: ", db);
  localStorage.setItem("todoList", JSON.stringify(db));
  todoItem.parentNode.removeChild(todoItem);
  updateTask();
  Sound.play();
}

// editTodo() is used to edit a particular todo
function editTodo(editButton) {
  let todoItem = editButton.closest(".todo-item");
  let todoInput = todoItem.querySelector(".todo-text input");

  if (editButton.classList.contains("fa-pen-to-square")) {
    editButton.classList.remove("fa-pen-to-square");
    editButton.classList.add("fa-save");
    todoInput.removeAttribute("readonly");
    todoInput.focus();
    Sound.play();
  } else {
    editButton.classList.remove("fa-save");
    editButton.classList.add("fa-pen-to-square");
    todoInput.setAttribute("readonly", "readonly");
    // update the value to localStorage here
    let itemId = todoItem.dataset.itemId;
    let db = JSON.parse(localStorage.getItem("todoList")) || [];
    let itemIndex = db.findIndex((i) => i.id === itemId);
    if (itemIndex !== -1) {
      db[itemIndex].todoText = todoInput.value;
      localStorage.setItem("todoList", JSON.stringify(db));
    }
    Sound.play();
  }
}

// This function generate random number of given length, we used this genrator to genrate our todo Id.
function generateRandomString(length) {
  var characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "todo";
  for (var i = 0; i < length - 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// This addItem() calls when we want to add new todo in our todo.
function addItem(event) {
  Sound.play();
  event.preventDefault();

  // Geting todoList from local storage.
  // If there is no todoList stored in storage then it assign to empty array.
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  console.log("Add Called, Lentght of DB: ", db.length);
  let textInput = document.querySelector("#todo-input");
  // Creating new Todo
  let newTodo = {
    todoText: textInput.value,
    status: "active",
    id: generateRandomString(10)
  };
  console.log("data added");

  // Updating with current db
  db.push(newTodo);

  // Saving to local Storage
  localStorage.setItem("todoList", JSON.stringify(db));
  textInput.value = "";
  getItems();
  updateTask();
}

// rendering the UI.
getItems();
