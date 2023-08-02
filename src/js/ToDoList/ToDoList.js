export default class ToDoList {
  constructor(container) {
    this.container = container;
    this.toDo = null;
    this.inProgress = null;
    this.done = null;
    this.toDoWrap = null;
    this.inProgressWrap = null;
    this.doneWrap = null;
    this.textFieldWrap = null;

    this.bindedToDom();
    this.init();
  }

  bindedToDom() {
    this.clickEvents = this.clickEvents.bind(this);
  }

  init() {
    this.createColumns();
    this.loadData();
    this.container.addEventListener("click", this.clickEvents);
  }

  createColumns() {
    this.toDo = document.createElement("section");
    this.toDo.classList.add("column", "todo-column");
    this.toDo.dataset.id = 1;

    this.inProgress = document.createElement("section");
    this.inProgress.classList.add("column", "inprogress-column");
    this.inProgress.dataset.id = 2;

    this.done = document.createElement("section");
    this.done.classList.add("column", "done-column");
    this.done.dataset.id = 3;

    this.container.append(this.toDo, this.inProgress, this.done);

    const toDoHeader = document.createElement("header");
    toDoHeader.classList.add("header", "to-do-header");
    toDoHeader.textContent = "To do";

    const addButtonToDo = document.createElement("button");
    addButtonToDo.classList.add("add-button");
    addButtonToDo.textContent = "+ Add another card";
    addButtonToDo.dataset.id = this.toDo.dataset.id;

    this.toDoWrap = document.createElement("div");
    this.toDoWrap.classList.add("tasks-wrapper", "todo-wrapper");
    this.toDoWrap.dataset.id = this.toDo.dataset.id;

    this.toDo.append(toDoHeader, addButtonToDo, this.toDoWrap);

    const inProgressHeader = document.createElement("header");
    inProgressHeader.classList.add("header", "in-progress-header");
    inProgressHeader.textContent = "In progress";

    const addButtonInProgress = document.createElement("button");
    addButtonInProgress.classList.add("add-button");
    addButtonInProgress.textContent = "+ Add another card";
    addButtonInProgress.dataset.id = this.inProgress.dataset.id;

    this.inProgressWrap = document.createElement("div");
    this.inProgressWrap.classList.add("tasks-wrapper", "inprogress-wrapper");
    this.inProgressWrap.dataset.id = this.inProgress.dataset.id;

    this.inProgress.append(
      inProgressHeader,
      addButtonInProgress,
      this.inProgressWrap
    );

    const doneHeader = document.createElement("header");
    doneHeader.classList.add("header", "done-header");
    doneHeader.textContent = "Done";

    const addButtonDone = document.createElement("button");
    addButtonDone.classList.add("add-button");
    addButtonDone.textContent = "+ Add another card";
    addButtonDone.dataset.id = this.done.dataset.id;

    this.doneWrap = document.createElement("div");
    this.doneWrap.classList.add("tasks-wrapper", "done-wrapper");
    this.doneWrap.dataset.id = this.done.dataset.id;

    this.done.append(doneHeader, addButtonDone, this.doneWrap);
  }

  createTextField(id) {
    this.textFieldWrap = document.createElement("div");
    this.textFieldWrap.classList.add("text-wrap");

    const textField = document.createElement("textarea");
    textField.classList.add("add-task-text");
    textField.setAttribute("placeholder", "Enter a title for this card...");
    textField.setAttribute("rows", "4");

    const taskButton = document.createElement("button");
    taskButton.classList.add("add-card-button");
    taskButton.textContent = "Add";

    const closeTextField = document.createElement("p");
    closeTextField.classList = "close-textfield";
    closeTextField.textContent = "✖";

    this.textFieldWrap.append(textField, taskButton, closeTextField);

    const targetWrapper = Array.from(
      document.querySelectorAll(".tasks-wrapper")
    );
    targetWrapper.forEach((el) => {
      if (id === el.dataset.id) {
        el.appendChild(this.textFieldWrap);
      }
    });
  }

  createTask(text, id) {
    const task = document.createElement("div");
    task.classList.add("task");

    const taskText = document.createElement("p");
    taskText.textContent = text;
    taskText.classList.add("task-text");

    const taskRemove = document.createElement("div");
    taskRemove.classList.add("remove-task");
    taskRemove.textContent = "✖";

    task.append(taskText, taskRemove);

    task.addEventListener("mouseenter", () => {
      task.querySelector(".remove-task").style.display = "block";
    });

    task.addEventListener("mouseleave", () => {
      task.querySelector(".remove-task").style.display = "none";
    });

    const targetWrapper = Array.from(
      document.querySelectorAll(".tasks-wrapper")
    );
    targetWrapper.forEach((el) => {
      if (id === el.dataset.id) {
        el.appendChild(task);
      }
    });
  }

  showTextarea() {
    this.textFieldWrap.style.display = "flex";
  }

  removeTextarea() {
    this.textFieldWrap.remove();
  }

  clickEvents(e) {
    const target = e.target;

    if (target.classList.contains("add-button")) {
      if (document.querySelector(".text-wrap")) {
        this.removeTextarea();
      }
      const column = target.closest(".column");
      const colId = column.dataset.id;
      this.createTextField(colId);
      this.showTextarea();
    } else if (target.classList.contains("add-card-button")) {
      const wrapper = target.closest(".tasks-wrapper");
      const wrapId = wrapper.dataset.id;
      const taskTitle = document.querySelector(".add-task-text").value;
      this.createTask(taskTitle, wrapId);
      this.removeTextarea();
      ToDoList.saveData();
    } else if (target.classList.contains("close-textfield")) {
      this.removeTextarea();
    } else if (target.classList.contains("remove-task")) {
      const targetTask = target.closest(".task");
      targetTask.remove();
      ToDoList.saveData();
    }
  }

  static saveData() {
    localStorage.removeItem("data");

    const todoWrap = document.querySelector(".todo-wrapper");
    const toDoTask = todoWrap.querySelectorAll(".task");
    let toDoTaskArray = null;
    if (toDoTask) {
      toDoTaskArray = [...toDoTask];
    }

    const inProgressWrap = document.querySelector(".inprogress-wrapper");
    const inProgressTask = inProgressWrap.querySelectorAll(".task");
    let inProgressArray = null;
    if (inProgressTask) {
      inProgressArray = [...inProgressTask];
    }

    const doneWrap = document.querySelector(".done-wrapper");
    const doneTask = doneWrap.querySelectorAll(".task");
    let doneArray = null;
    if (doneTask) {
      doneArray = [...doneTask];
    }

    const toDoData = {};
    if (toDoTaskArray) {
      toDoTaskArray.forEach((el, i) => {
        Array.from(el.children).forEach((item) => {
          if (item.classList.contains("task-text")) {
            toDoData[i] = item.textContent;
          }
        });
      });
    }

    const inProgressData = {};
    if (inProgressArray) {
      inProgressArray.forEach((el, i) => {
        Array.from(el.children).forEach((item) => {
          if (item.classList.contains("task-text")) {
            inProgressData[i] = item.textContent;
          }
        });
      });
    }

    const doneData = {};
    if (doneArray) {
      doneArray.forEach((el, i) => {
        Array.from(el.children).forEach((item) => {
          if (item.classList.contains("task-text")) {
            doneData[i] = item.textContent;
          }
        });
      });
    }

    const saveData = {
      "to-do": toDoData,
      "in-progress": inProgressData,
      done: doneData,
    };

    localStorage.setItem("data", JSON.stringify(saveData));
  }

  loadData() {
    if (localStorage.getItem("data")) {
      const loadData = JSON.parse(localStorage.getItem("data"));

      if (Object.keys(loadData["to-do"]).length !== 0) {
        for (const key in loadData["to-do"]) {
          this.createTask(loadData["to-do"][key], this.toDoWrap.dataset.id);
        }
      }

      if (Object.keys(loadData["in-progress"]).length !== 0) {
        for (const key in loadData["in-progress"]) {
          this.createTask(
            loadData["in-progress"][key],
            this.inProgressWrap.dataset.id
          );
        }
      }

      if (Object.keys(loadData.done).length !== 0) {
        for (const key in loadData.done) {
          this.createTask(loadData.done[key], this.doneWrap.dataset.id);
        }
      }
    }
  }
}
