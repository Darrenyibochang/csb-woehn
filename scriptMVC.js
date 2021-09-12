// - 1. Show how many active tasks left at the left of footer
// - 2. Three tabs in center of footer to toggle between All, Active, Completed and show filtered tasks
// - 3. Left header button to toggle all tasks. If any task is not completed, set all tasks to completed. If all tasks are completed, set all to active
// 4. Type in the input, press enter key to add the task -> add event listener to 'keyup' and check if it is 'enter' key
// -5. Hover on task, shows pencil icon. Clicking pencil icon allows user to edit the task. Once editing is done, a checkmark icon allows user to save the editing
// -6. During editing, press enter key to save the task -> add event listener to 'keyup' and check if it is 'enter' key
// 7. Close and reopen the application, it should keep all the previous tasks. // localStorage -> save to localStorage on each operation -> load from storage on initial load

// pencil html code: '&#9998;';
// checkmark html code: '&#10003;';

// hover and tab border color: pink

// {checked: boolean, value: string, id: string}

const TABS = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  COMPLETE: "COMPLETE"
};

const model = {
  todoList: [],
  activeTab: TABS.ALL,
  editingTaskId: null
};

// viewer
const getListContainer = () => {
  return document.querySelector(".list-container");
};

const createTaskNode = (value, checked, id, editingTaskId) => {
  const li = document.createElement("li");

  li.id = id;

  const isEditingNode = editingTaskId === id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;

  if (isEditingNode) {
    checkbox.disabled = true;
    const input = document.createElement("input");

    input.value = value;
    input.className = "task-input";
    const confirmDiv = document.createElement("div");
    confirmDiv.className = "confirm-icon";
    confirmDiv.innerHTML = "&#10003;";
    li.appendChild(checkbox);
    li.appendChild(input);
    li.appendChild(confirmDiv);
  } else {
    const span = document.createElement("span");
    span.innerHTML = value;
    if (checked) {
      span.className = "checked";
    }

    const deleteDiv = document.createElement("div");
    deleteDiv.className = "delete-icon";
    deleteDiv.innerHTML = "&#10005;";

    const editDiv = document.createElement("div");
    editDiv.className = "edit-icon";
    editDiv.innerHTML = "&#9998;";

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editDiv);
    li.appendChild(deleteDiv);
  }

  return li;
};

const updateTaskList = () => {
  const listContainer = getListContainer();
  const { todoList, activeTab, editingTaskId } = model;

  listContainer.innerHTML = "";

  todoList
    .filter((todo) => {
      if (activeTab === TABS.ALL) {
        return true;
      } else if (activeTab === TABS.ACTIVE) {
        return !todo.checked;
      } else {
        return todo.checked;
      }
    })
    .forEach((todo) => {
      const taskNode = createTaskNode(
        todo.value,
        todo.checked,
        todo.id,
        editingTaskId
      );
      listContainer.appendChild(taskNode);
    });
};

const updateTasksLeft = () => {
  const { todoList } = model;
  const activeTasks = todoList.filter((task) => !task.checked);
  const activeCount = activeTasks.length;
  const tasksLeftContainer = document.querySelector(".tasks-left-container");
  if (activeCount === 0) {
    tasksLeftContainer.innerHTML = "No task left";
  } else {
    tasksLeftContainer.innerHTML = `${activeCount} ${
      activeCount === 1 ? "item" : "items"
    } left`;
  }
};

const updateTabs = () => {
  const { activeTab } = model;
  const tabsElmts = document.querySelectorAll(".tab");
  tabsElmts.forEach((ele) => {
    const name = ele.getAttribute("name");
    if (name === activeTab) {
      ele.className = "tab active";
    } else {
      ele.className = "tab";
    }
  });
};

const updateView = () => {
  updateTaskList();
  updateTasksLeft();
  updateTabs();
  localStorage.setItem("todoList", JSON.stringify(model.todoList));
};

// controller
const handleAddNewTask = () => {
  const textInput = document.querySelector(".text-input");
  const { value } = textInput;

  const newTask = {
    checked: false,
    value,
    id: new Date().toISOString()
  };
  model.todoList.push(newTask);
  textInput.value = "";
  updateView();
};

const handleClearAll = () => {
  model.todoList = [];
  updateView();
};

const toggleTaskChecked = (id) => {
  //   const targetTask = model.todoList.find((task) => task.id === id);
  //   targetTask.checked = !targetTask.checked;
  const newTaskList = model.todoList.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        checked: !task.checked
      };
    } else {
      return task;
    }
  });

  model.todoList = newTaskList;
  updateView();
};

const removeTaskRow = (id) => {
  const newTaskList = model.todoList.filter((task) => {
    return task.id !== id;
  });
  model.todoList = newTaskList;
  updateView();
};

const toggleEditing = (id) => {
  const { editingTaskId } = model;
  if (editingTaskId === id) {
    model.editingTaskId = null;
  } else {
    model.editingTaskId = id;
  }
  updateView();
};

const saveEditing = (id, value) => {
  const newList = model.todoList.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        value
      };
    } else {
      return todo;
    }
  });

  model.editingTaskId = null;
  model.todoList = newList;
  updateView();
};

const handleListContainerClick = (e) => {
  const { target } = e;
  if (
    target.tagName === "INPUT" &&
    target.getAttribute("type") === "checkbox"
  ) {
    const li = target.parentNode;
    const taskId = li.id;
    toggleTaskChecked(taskId);
    return;
  } else if (target.className === "delete-icon") {
    //   removeTaskRow(target);
    const li = target.parentNode;
    const taskId = li.id;
    removeTaskRow(taskId);
  } else if (target.className === "edit-icon") {
    const li = target.parentNode;
    const taskId = li.id;
    toggleEditing(taskId);
  } else if (target.className === "confirm-icon") {
    const li = target.parentNode;
    const taskId = li.id;
    const taskInput = document.querySelector(".task-input");
    saveEditing(taskId, taskInput.value);
  }
};

const handleTabContainerClick = (e) => {
  const { target } = e;
  if (target.classList.contains("tab")) {
    const tabName = target.getAttribute("name");
    model.activeTab = tabName;
  }
  updateView();
};

const handleToggleAll = () => {
  const { todoList } = model;
  const hasAllChecked = todoList.every((todo) => todo.checked);
  const newList = todoList.map((todo) => {
    return {
      ...todo,
      checked: !hasAllChecked
    };
  });
  model.todoList = newList;
  updateView();
};

const handleTaskInputKeydown = (e) => {
  const { key } = e;
  if (key === "Enter") {
    handleAddNewTask();
  }
};

const handleListContainerKeyDown = (e) => {
  const { key, target } = e;
  if (key === "Enter") {
    const taskInputValue = target.value;
    const li = target.parentNode;
    const taskId = li.id;
    saveEditing(taskId, taskInputValue);
  }
};

const loadEvents = () => {
  const addButton = document.querySelector("#addButton");
  const clearAllBtn = document.querySelector("#clearButton");
  const tabsContainer = document.querySelector(".tabs");
  const toggleAllButton = document.querySelector(".toggle-all-button");
  const textInput = document.querySelector(".text-input");

  const listContainer = getListContainer();

  tabsContainer.addEventListener("click", handleTabContainerClick);
  toggleAllButton.addEventListener("click", handleToggleAll);
  addButton.addEventListener("click", handleAddNewTask);
  clearAllBtn.addEventListener("click", handleClearAll);

  listContainer.addEventListener("click", handleListContainerClick);

  textInput.addEventListener("keydown", handleTaskInputKeydown);
  listContainer.addEventListener("keydown", handleListContainerKeyDown);
};

const loadState = () => {
  const stateStr = localStorage.getItem("todoList");
  if (stateStr) {
    try {
      const todoList = JSON.parse(stateStr);
      model.todoList = todoList;
      updateView();
    } catch (e) {}
  }
};
loadEvents();
loadState();
