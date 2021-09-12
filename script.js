const getListContainer = () => {
  return document.querySelector(".list-container");
};

const createTaskNode = (value, checked) => {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.innerHTML = value;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;

  const deleteDiv = document.createElement("div");
  deleteDiv.className = "delete-icon";
  deleteDiv.innerHTML = "&#10005;";

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteDiv);
  return li;
};

const toggleTaskChecked = (checkboxElement) => {
  const span = checkboxElement.nextSibling;
  span.classList.toggle("checked");
};

const removeTaskRow = (deleteDivElement) => {
  const li = deleteDivElement.parentNode;
  const listContainer = getListContainer();
  listContainer.removeChild(li);
};

const handleListClick = (e) => {
  const { target } = e;
  if (target.tagName === "INPUT") {
    toggleTaskChecked(target);
    return;
  } else if (target.className === "delete-icon") {
    removeTaskRow(target);
  }
};

const handleClearAll = () => {
  const listContainer = getListContainer();
  listContainer.innerHTML = "";
};

const handleAddNewTask = () => {
  const textInput = document.querySelector(".text-input");
  const listContainer = getListContainer();

  const taskNode = createTaskNode(textInput.value, false);
  listContainer.appendChild(taskNode);
  textInput.value = "";
};

const loadEvents = () => {
  const addButton = document.querySelector("#addButton");
  const clearAllBtn = document.querySelector("#clearButton");
  const listContainer = getListContainer();

  listContainer.addEventListener("click", handleListClick);
  clearAllBtn.addEventListener("click", handleClearAll);
  addButton.addEventListener("click", handleAddNewTask);
};

loadEvents();
