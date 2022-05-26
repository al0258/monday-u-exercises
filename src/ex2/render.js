export default class Render {
    constructor(addItem, deleteItemHandler, getAllItems) {
      this.userInput = document.querySelector(".new-to-do-input");
      this.todoListElement = document.querySelector(".todo-list");
      this.alertBox = document.querySelector(".alert");
      this.alertBoxText = document.querySelector(".alert-inner-text");
      this.addItem = addItem;
      this.deleteItemHandler = deleteItemHandler;
      this.getAllItems = getAllItems;
    }
  
    init() {
    this.updateTasksNum()
      const aletBoxCloseBtn = document.querySelector(".alert-close-button");
      aletBoxCloseBtn.addEventListener("click", () => {
        this.closeAlertBox();
      });
  
      const deleteAllButton = document.querySelector(".delete-all-button");
      deleteAllButton.addEventListener("click", () => {
          console.log(this.todoListElement.childNodes);
          for (let index = this.todoListElement.childNodes.length-1; index > 0; index--) {
            this.deleteItem(this.todoListElement.childNodes[index]);
          }
      });
    }
  
    get getUserInput() {
        // Get's the users to do input from the input box
      return this.userInput.value;
    }
  
    resetInput() {
        // resets the input
      this.userInput.value = "";
    }
  
    addButtonClicked() {
      if (this.getUserInput) {
        this.checkNewTaskInput(this.getUserInput);
        this.resetInput();
      } 
      else {
        this.alert(null);
      }
    }
  
    checkNewTaskInput(text) {
      const textList = text.split(",");
      if (textList.length > 1) {
        textList.forEach((text) => this.checkUserInput(text.trim()));
      } 
      else {
        this.checkUserInput(text.trim());
      }
    }
  
    checkUserInput(text) {
      const itemsList = this.getAllItems();
      const isExists = itemsList.some((item) => item.text === text);

        // checks if task already exists
        if (isExists) {
            return this.alert(`You are trying to add ${text} again`, "warning");
        }
  
      const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      
      if (!format.test(text)) {
        this.addNewItem(text);
      } 
      else {
        this.alert('Please use letters and numbers only. Oh, and commas', "warning");
      }
    }
  
    addNewItem(text) {
      const time = new Date().toLocaleDateString();
      const item = {text, time, done: false,
        toggleTaskDone() {
            //Changes the state of which the item is either complete or not complete
          this.done = !this.done;
        },
      };
  
      this.addItem(item).then((itemName) =>
        this.createNewToDoElement({ ...item, name: itemName })
      );
    }
  
    createNewToDoElement(item) {
        //create a new list item
      const listItem = document.createElement("li");
        
      // Create the comleted checkbox
      const listItemCheckbox = document.createElement("input");
      listItemCheckbox.setAttribute("type", "checkbox");
      listItemCheckbox.className = "todo-item-checkbox";
      listItemCheckbox.addEventListener("change", () => {
        item.toggleTaskDone();
      });
      
      // Add text to the list item
      const listItemText = document.createElement("span");
       listItemText.className = "list-item-text";
      listItemText.innerText = '   ' + item.text;
      listItemText.addEventListener("click", () => {
        this.alert(this.showTaskDetails(item), "info");
      });
  
      const removeButtonContainer = document.createElement("span");
      removeButtonContainer.classList.add("remove-button")
        removeButtonContainer.innerHTML = `<i class="fas fa-trash"></i>`;
        removeButtonContainer.addEventListener("click", () => {
            this.deleteItem(listItem);  
        });
      
      // Build the element
      listItem.appendChild(listItemCheckbox);
      listItem.appendChild(listItemText);
      listItem.appendChild(removeButtonContainer);
        // Add the element to the list item
      this.todoListElement.appendChild(listItem);

        // Update the amount of tasks
      this.updateTasksNum();
    }
  
    deleteItem(itemToDelete) {
    console.log(itemToDelete);
      const container = this.todoListElement;
      //itemToDelete.classList.add("leave");
  
      const updateTasksNum = this.updateTasksNum;

      container.removeChild(itemToDelete);
        updateTasksNum.call(this);
  
    //   setTimeout(() => {
    //     container.removeChild(itemToDelete);
    //     updateTasksNum.call(this);
    //   }, 800);
  
      this.deleteItemHandler(itemToDelete.innerText);
    }
  
    updateTasksNum() {
        const pendingTasksCounter = document.querySelector(".pending-num");
        pendingTasksCounter.textContent = (this.todoListElement.childNodes.length-1).toString();
    }
  
    closeAlertBox() {
      this.alertBox.classList.remove("show", "warning", "info");
    }
  
    showTaskDetails(item) {
      return `<span><span>To do:</span> ${item.text}</span></br>
      <span><span>Creation-date:</span> ${item.time}</span></br>
      ${
        item.done
          ? `Challange completed`
          : `Challange is yet completed`
      } `;
    }
  
    alert(alert, type) {
      if (!alert) {
        this.alertBox.classList.add("show", "warning");
        this.alertBoxText.innerText =
          "please write some text before adding new ToDo";
      } else {
        this.alertBox.classList.add("show", type);
        this.alertBoxText.innerHTML = alert;
      }
    }
  }