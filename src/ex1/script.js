const inputBox = document.querySelector(".inputfield input");
const addButton = document.querySelector(".inputfield button");
console.log(inputBox);

inputBox.onkeyup = () => {
    let userData = inputBox.value;
    if (userData.trim()!=0){
        addButton.classList.add("active");
    }
    else{
        addButton.classList.remove("active");
    }
}

addButton.onclick = () => {
    let getLocalStorage = localStorage.getItem("New Todo");
    if(getLocalStorage == null){
        listArr = [];
    }
    else{
        listArr = JSON.parse(getLocalStorage);
    }
    listArr.push
}