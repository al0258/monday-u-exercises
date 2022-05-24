const inputBox = document.querySelector(".new-to-do-input");
const addButton = document.querySelector(".add-to-do-button");
const todoList = document.querySelector(".todo-list");
const deleteAllButton = document.querySelector(".delete-all-button");
const localStorageName = "New Todo";

renderToDoList();

inputBox.addEventListener("keyup", function(){
    const userData = inputBox.value;
    if (userData.trim()!==0){
        addButton.classList.add("active");
    }
    else{
        addButton.classList.remove("active");
    }
});


function checkIfTasksExist() {
    const getLocalStorage = localStorage.getItem(localStorageName);
    if(getLocalStorage === null){
        listArr = [];
    }
    else{
        listArr = JSON.parse(getLocalStorage);
    }
    return listArr;
}

addButton.addEventListener("click",function(){
    const userData = inputBox.value;
    let listArr = checkIfTasksExist();
    listArr.push(userData);
    localStorage.setItem(localStorageName, JSON.stringify(listArr));
    renderToDoList();
    addButton.classList.remove("active");
    inputBox.value='';
});

function renderToDoList(){
    let listArr = checkIfTasksExist();
    const pendingTasksCounter = document.querySelector(".pending-num");
    pendingTasksCounter.textContent = listArr.length;
    if (listArr.length > 0) {
        deleteAllButton.classList.add("active");
    }
    else{
        deleteAllButton.classList.remove("active");
    }
    let newListItem = ``;
    listArr.forEach((element, index)=>{
        newListItem +=`<li> ${element} <span onclick="deleteTask(${index})"; ><i class="fas fa-trash"></i></span></li>`;
    });
    todoList.innerHTML = newListItem;
}

function deleteTask(index){
    const getLocalStorage = localStorage.getItem(localStorageName);
    listArr = JSON.parse(getLocalStorage);
    listArr.splice(index, 1);
    localStorage.setItem(localStorageName, JSON.stringify(listArr));
    renderToDoList();
}

deleteAllButton.addEventListener("click", function(){
    listArr=[];
    localStorage.setItem(localStorageName, JSON.stringify(listArr));
    renderToDoList();
});