import ToDoList from "../ToDoList/ToDoList";

export default class DragAndDrop {
  constructor() {
    this.draggedElement = null;
    this.ghostElement = null;
    this.dropPoint = null;

    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseleave = this.onMouseleave.bind(this);
    this.onMouseup = this.onMouseup.bind(this);

    this.shiftX = null;
    this.shiftY = null;
    this.init();
  }

  init() {
    document.addEventListener("mousedown", this.onMousedown);
    document.addEventListener("mousemove", this.onMousemove);
    document.addEventListener("mouseleave", this.onMouseleave);
    document.addEventListener("mouseup", this.onMouseup);
  }

  onMousedown(e) {
    if (!e.target.classList.contains("task")) {
      return;
    }
    const task = document.querySelector('.task');
    const taskWidth = task.offsetWidth;
    const taskHeight = task.offsetHeight;

    this.draggedElement = e.target;
    this.draggedElement.style.width = taskWidth + 'px';
    this.draggedElement.style.height = taskHeight + 'px';
    this.ghostElement = e.target.cloneNode(true);
    this.ghostElement.classList.add("dragged");
    document.body.appendChild(this.ghostElement);
    this.shiftX = e.pageX - this.draggedElement.getBoundingClientRect().left;
    this.shiftY = e.pageY - this.draggedElement.getBoundingClientRect().top;
    this.moveAt(e.pageX, e.pageY);
  }

  onMousemove(e) {
    e.preventDefault();
    if (
      e.clientX <= 0 ||
      e.clientY <= 0 ||
      e.clientX >= window.innerWidth ||
      e.clientY >= window.innerHeight
    ) {
      this.onMouseleave();
    }
    if (!this.draggedElement) {
      return;
    }

    this.draggedElement.classList.add("invisible");

    const closest = document.elementFromPoint(e.clientX, e.clientY);
    this.draggedElement.classList.remove("invisible");
    this.moveAt(e.pageX, e.pageY);
    this.showDropPoint(closest, e);

    if (
      !closest.classList.contains("task") &&
      !closest.classList.contains("tasks-wrapper") &&
      !closest.classList.contains("drop-point") &&
      this.dropPoint !== null
    ) {
      this.dropPoint.remove();
      this.dropPoint = null;
    }
  }

  onMouseleave() {
    if (!this.draggedElement) {
      return;
    }
    this.draggedElement.classList.remove("invisible");
    this.ghostElement.remove();
    this.ghostElement = null;
    this.draggedElement = null;
    if (this.dropPoint) {
      this.dropPoint.remove();
      this.dropPoint = null;
    }
  }

  onMouseup(e) {
    const closest = document.elementFromPoint(e.clientX, e.clientY);
    if (
      !closest.classList.contains("task") &&
      !closest.classList.contains("tasks-wrapper") &&
      !this.dropPoint
    ) {
      this.onMouseleave();
      return;
    }

    if (!this.draggedElement) {
      return;
    }

    const closestParent = closest.closest(".tasks-wrapper");
    closestParent.appendChild(this.draggedElement);
    closestParent.insertBefore(this.draggedElement, this.dropPoint);

    this.onMouseleave();

    ToDoList.saveData();
  }

  moveAt(pageX, pageY) {
    this.ghostElement.style.left = `${pageX - this.shiftX}px`;
    this.ghostElement.style.top = `${pageY - this.shiftY}px`;
  }

  showDropPoint(closest, e) {
    if (!closest.classList.contains("task")) {
      return;
    }
    if (this.dropPoint) {
      this.dropPoint.remove();
      this.dropPoint = null;
    }

    this.dropPoint = document.createElement("div");
    this.dropPoint.classList.add("drop-point");
    const height = this.ghostElement.offsetHeight;
    this.dropPoint.style.height = `${height}px`;

    if (closest.classList.contains("tasks-wrapper")) {
      closest.appendChild(this.dropPoint);
    } else if (closest.classList.contains("task")) {
      const { top } = closest.getBoundingClientRect();
      const closestParent = closest.closest(".tasks-wrapper");
      if (e.pageY > window.scrollY + top + closest.offsetHeight / 2) {
        closestParent.insertBefore(this.dropPoint, closest.nextElementSibling);
      } else {
        closestParent.insertBefore(this.dropPoint, closest);
      }
    }
  }
}
