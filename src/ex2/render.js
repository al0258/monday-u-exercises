export default class Render {
    constructor(addItem, deleteItemHandler, getAllItems, taskFinished) {
        this.userInput = document.querySelector(".new-to-do-input");
        this.todoListElement = document.querySelector(".todo-list");
        this.alertBox = document.querySelector(".alert");
        this.alertBoxText = document.querySelector(".alert-inner-text");
        this.pendingTasksElement = document.querySelector(".pending-num");
        this.addItem = addItem;
        this.deleteItemHandler = deleteItemHandler;
        this.getAllItems = getAllItems;
        this.taskFinished = taskFinished;
        this.pendingTasksCounter = 0;
    }

    init() {
        //this.pendingTasksElement.textContent = (this.todoListElement.childNodes.length - 1);
        this.updateTasksNum();
        const alertBoxCloseBtn = document.querySelector(".alert-close-button");
        alertBoxCloseBtn.addEventListener("click", () => {
            this.closeAlertBox();
        });

        const deleteAllButton = document.querySelector(".delete-all-button");
        deleteAllButton.addEventListener("click", () => {
            // console.log(this.todoListElement.childNodes);
            for (
                let index = this.todoListElement.childNodes.length - 1; index > 0; index--
            ) {
                console.log(this.todoListElement.childNodes[index].childNodes[0].classList.contains('todo-item-checkbox-clicked'));
                this.deleteItem(this.todoListElement.childNodes[index]);
            }
        });
    }

    addButtonClicked() {
        if (this.getUserInput) {
            this.checkNewTaskInput(this.getUserInput);
            this.resetInput();
        } else {
            this.alert(null);
        }
    }

    checkNewTaskInput(text) {
        const textList = text.split(",");
        if (textList.length > 1) {
            textList.forEach((text) => this.checkUserInput(text.trim()));
        } else {
            this.checkUserInput(text.trim());
        }
    }

    checkUserInput(text) {
        const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (!format.test(text)) {
            // this.addNewItem(text);
            this.addNewItem(this.buildNewItem(text, null, false))
        } else {
            this.alert(
                "Please use letters and numbers only. Oh, and commas",
                "warning"
            );
        }
    }

    toggleTaskDone(listItem) {
        //Changes the state of which the item is either complete or not complete
        // console.log(listItem);
        listItem.done = !listItem.done;
        if (listItem.done) {
            this.pendingTasksCounter--;
        } else {
            this.pendingTasksCounter++;
        }
        this.updateTasksNum();
        this.taskFinished(listItem.text);
        // console.log(this.pendingTasksCounter);
    }

    buildNewItem(text, time, done) {
        if (time === null) {
            time = new Date().toLocaleDateString();
        }
        const item = {
            text,
            time,
            done: done,
        };

        return item;
    }

    addNewItem(item) {
        this.addItem(item).then((itemName) => {
            if (itemName !== "it exists") {
                this.createNewToDoElement({
                    ...item,
                    name: itemName,
                });
            }
        });
    }

    createCheckBox(item) {
        const listItemCheckbox = document.createElement("input");
        listItemCheckbox.setAttribute("type", "checkbox");
        listItemCheckbox.className = "todo-item-checkbox";
        if (item.done) {
            listItemCheckbox.classList.add("todo-item-checkbox-clicked");
        }
        listItemCheckbox.addEventListener("change", () => {
            this.toggleTaskDone(item);
            if (item.done) {
                listItemCheckbox.classList.add("todo-item-checkbox-clicked");
            } else {
                listItemCheckbox.classList.remove("todo-item-checkbox-clicked");
            }
        });
        return listItemCheckbox;
    }

    createRemoveButton(listItem) {
        const removeButtonContainer = document.createElement("span");
        removeButtonContainer.classList.add("remove-button");
        removeButtonContainer.innerHTML = `<i class="fas fa-trash"></i>`;
        removeButtonContainer.addEventListener("click", () => {
            this.deleteItem(listItem);
        });
        return removeButtonContainer;
    }

    createListItemText(item) {
        const listItemText = document.createElement("span");
        listItemText.className = "list-item-text";
        listItemText.innerText = item.text;
        listItemText.addEventListener("click", () => {
            this.alert(this.showTaskDetails(item), "info");
        });
        return listItemText;
    }

    createNewToDoElement(item) {
        // console.log(item);
        //create a new list item
        const listItem = document.createElement("li");

        // Create the comleted checkbox
        const listItemCheckbox = this.createCheckBox(item);

        // Add text to the list item
        const listItemText = this.createListItemText(item);

        // Create remove button
        const removeButtonContainer = this.createRemoveButton(listItem);

        // Build the element
        listItem.appendChild(listItemCheckbox);
        listItem.appendChild(listItemText);
        listItem.appendChild(removeButtonContainer);

        // Add the element to the list item
        this.todoListElement.appendChild(listItem);

        // Update the amount of tasks
        if (!item.done) {
            this.pendingTasksCounter++;
        }
        this.updateTasksNum();
    }

    deleteItem(itemToDelete) {
        // console.log(itemToDelete);
        const container = this.todoListElement;

        container.removeChild(itemToDelete);

        //Checks if the item was checked
        //If it is, it dosen't take it from the counter
        // !itemToDelete.querySelector('.todo-item-checkbox').checked &&
        if (!itemToDelete.childNodes[0].classList.contains('todo-item-checkbox-clicked')) {
            this.pendingTasksCounter--;
            this.updateTasksNum();
        }
        this.deleteItemHandler(itemToDelete.innerText);
    }

    updateTasksNum() {
        this.pendingTasksElement.textContent = (this.pendingTasksCounter);
    }

    closeAlertBox() {
        this.alertBox.classList.remove("show", "warning", "info");
    }

    showTaskDetails(item) {
        return `<span><span>To do:</span> ${item.text}</span></br>
      <span><span>Creation-date:</span> ${item.time}</span></br>
      ${item.done ? `Challange completed` : `Challange is yet completed`} `;
    }

    alert(alert, type) {
        if (!alert) {
            this.alertBox.classList.add("show", "warning");
            this.alertBoxText.innerText = "please write some text before adding new ToDo";
        } else {
            this.alertBox.classList.add("show", type);
            this.alertBoxText.innerHTML = alert;
        }
    }

    get getUserInput() {
        // Get's the users to do input from the input box
        return this.userInput.value;
    }

    resetInput() {
        // resets the input
        this.userInput.value = "";
    }
}