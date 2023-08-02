// TODO: write code here
import ToDoList from "./ToDoList/ToDoList";
import DragAndDrop from "./DragAndDrop/DragAndDrop";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  new ToDoList(container);
  new DragAndDrop();
});
