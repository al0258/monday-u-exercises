class Main {
    constructor() {
        this.todoInput = document.querySelector('#todo-input');
        this.addBtn = document.querySelector('#todo-input-btn');
        this.sortOrder = document.querySelector('#select-sort');
        this.editTodoElement = document.querySelector('#edit-todo');
        this.editTodoInput = document.querySelector('#edit-todo-input');
        this.editTodoApproveBtn = document.querySelector('#edit-todo-approve-btn');
        this.editTodoCancelBtn = document.querySelector('#edit-todo-cancel-btn');
        this.todoList = document.querySelector('#todo-list');
        this.deleteAllBtn = document.querySelector('#footer-btn');
        this.spinnerElement = document.querySelector('#spinner');
        this.alertBox = document.querySelector(".alert");
        this.alertBoxText = document.querySelector(".alert-inner-text");
        this.alertBoxCloseBtn = document.querySelector(".alert-close-button");
        this.itemClient = new ItemClient;
        this.localStorageManager = new LocalStorageManager;
        this.todoListData = [];
        this.ALERT_TYPE = {
            WARNING: 'warning',
            INFO: 'info'
          }
    }

    init() {
        this.todoInput.addEventListener('keyup', (event) => this._onUserInputKeyUp(event));
        this.todoInput.addEventListener('keypress', (event) => this._onAddButtonKeyPress(event));
        this.addBtn.addEventListener('click', (event) => this._onAddButtonClicked(event));
        this.sortOrder.addEventListener('change', (event) => this._onSortChange(event));
        this.editTodoApproveBtn.addEventListener('click', (event) => this._onEditTodoApproveButton(event));
        this.editTodoCancelBtn.addEventListener('click', (event) => this._onEditTodoCancelButton(event));
        this.deleteAllBtn.addEventListener('click', (event) => this._onDeleteAllButtonClicked(event));
        this.alertBoxCloseBtn.addEventListener("click", (event) => {this.closeAlertBox(event)});
        this._setSortBy();
    }

    async render() {
        try {
            this.toggleSpinner(true);
            await Promise.all([
                this.showPendingTodos(),
                this.showTodosList()
            ]);
        } catch (e) {
            console.error(e)
        }
        this.toggleSpinner(false);
        setTimeout(() => this.todoInput.focus(), 0);
    }


    _onUserInputKeyUp(event) {
        if (event) {
            if (this.todoInput.value.trim().length !== 0) {
                this.addBtn.classList.add('active');
            } else {
                this.addBtn.classList.remove('active');
            }
        }
    }

    _onAddButtonKeyPress(event) {
        if (event.key === 'Enter' && this.addBtn.classList.contains('active')) {
            this._onAddButtonClicked();
        } else if (event.key === 'Enter' && this.todoInput.value.trim().length === 0) {
            this.alert('Please add a new todo', this.ALERT_TYPE.WARNING);
        }
    }

    async _onAddButtonClicked() {
        let todos;
        this.toggleSpinner(true);
        try {
            this.addBtn.disabled = true;
            this.todoInput.disabled = true;
            todos = await this.itemClient.addTodo(this.todoInput.value);
            await this.render();
        } catch (e) {
            console.error(e);
        }
        this.toggleSpinner(false);
        this.addBtn.classList.remove('active');
        this.addBtn.disabled = false;
        this.todoInput.disabled = false;
        (todos && todos.success) && setTimeout(() => this.checkForDuplicatePokemons(todos.body), 0);
    }

    _onSortChange() {
        this.localStorageManager.saveSortBy(this.sortOrder.value);
        this.render();
    }

    async _onEditTodoApproveButton() {
        this.currentTodoEdit.message = this.currentTodoEdit.item = this.editTodoInput.value;
        await this.itemClient.editTodo(this.currentTodoEdit.id, this.currentTodoEdit);
        this.editTodoElement.style.display = 'none';
        this._toggleElementsForEditTodo();
        await this.render();
    }

    _onEditTodoCancelButton() {
        this.editTodoElement.style.display = 'none';
    }

    async _onDeleteAllButtonClicked() {
        await this.itemClient.deleteAllTodos();
        await this.render();
    }

    checkForDuplicatePokemons(todos) {
        const duplicatesPokemons = todos.filter(item => item.type == 'pokemonExists');
        if (!duplicatesPokemons.length) {
            return;
        }
        let content = 'The following pokemons already exist: <br>\n';
        duplicatesPokemons.forEach(({
            pokemon
        }) => {
            content += `id: ${pokemon.id}, name: ${pokemon.name} <br>\n`;
        });
        this.toggleSpinner(false);
        this.alert(content, this.ALERT_TYPE.WARNING);
    }

    toggleSpinner(animate) {
        if (!animate) {
            this.spinnerElement.style.display = 'none';
            return;
        }
        this.spinnerElement.style.display = 'block';
    }


    async showPendingTodos() {
        const pendingTodos = document.querySelector(".pending-todos");
        const tmp = await this.itemClient.getPendingTodos();
        pendingTodos.textContent = tmp.body.count;
    }

    async getTodoListData() {
        const sortOrder = this.localStorageManager.getSortBy();
        const response = await this.itemClient.getAllTodos(sortOrder);
        this.todoListData = response.success && Array.isArray(response.body) ? response.body : [];
    }

    async showTodosList() {
        await this.getTodoListData();

        if (!this.todoListData.length) {
            this.showContent(this._handleEmptyTodoListContent());
            return;
        }
        let todoListContent = '';
        this.deleteAllBtn.classList.add('active');
        this.todoListData.forEach((element, index) => {
            todoListContent += this._handleTodoListContent(element, index);
        });
        setTimeout(() => this.addTodosListeneres(), 0);
        this.showContent(todoListContent);
    }

    showContent(content) {
        console.log(content);
        this.todoList.innerHTML = content;
        this.todoInput.value = '';
    }

    _handleTodoListContent(element, index) {
        console.log(element);
        const checked = element.checked ? 'checked' : '';
        const checkedclass = element.checked ? 'todo-item-checkbox-clicked' : '';
        const pic = element.type === 'pokemon' ? `<img class="pokemon-pic" src="${element.pokemon.image}" alt="">` : '&emsp;&emsp;';
        const editBtn = (element.type === 'text') ? `<span id="todo-edit-${element.id}" class="icon-edit"><i class="fas fa-pen" ></i></span>` : '';
        const todoListContent = `<li> 
        <input id="todo-checkbox-${element.id}" type="checkbox" class="todo-item-checkbox ${checkedclass}" name="todoCheckbox" ${checked}>
        ${pic}
        <span id="todo-element-${element.id}"> ${element.message}</span>
        ${editBtn}
        <span id="todo-delete-${element.id}" class="icon-delete"><i class="fas fa-trash" ></i></span>
        </li>`;
        return todoListContent;
    }

    _handleEmptyTodoListContent() {
        const todoListContent = `<p class="empty-todo-list">
        Oh, would you look at that... Your Todo list is empty </br>
        <span class="icon"><img src="https://pbs.twimg.com/media/EguuUS1XsAAqfhl?format=jpg&name=360x360"></span> </br>
        Either you are very lazy or you just really don't have anything to do</p>`;
        this.deleteAllBtn.classList.remove('active');
        return todoListContent;
    }

    async addTodosListeneres() {
        this.todoListData.forEach((element, index) => {
            if (element.type === 'text') {
                document.getElementById(`todo-edit-${element.id}`).addEventListener('click', () => this.openEditTodo(element, index));
            }
            document.getElementById(`todo-element-${element.id}`).addEventListener('click', () => this.showSelectedTodo(element));
            document.getElementById(`todo-delete-${element.id}`).addEventListener('click', () => this.deleteTodo(element));
            document.getElementById(`todo-checkbox-${element.id}`).addEventListener('change', () => this.toggleChecked(element));
        })
    }

    async toggleChecked(element) {
        this.currentTodoEdit = element;
        this.currentTodoEdit.checked = !this.currentTodoEdit.checked;
        await this.itemClient.editTodo(this.currentTodoEdit.id, this.currentTodoEdit);
        document.getElementById(`todo-checkbox-${element.id}`).classList.toggle("todo-item-checkbox-clicked");
        // await this.render();
    }

    showSelectedTodo(element) {
        this.alert(this.showTaskDetails(element), this.ALERT_TYPE.INFO);
    }

    openEditTodo(element) {
        this.editTodoInput.value = element.item;
        this.editTodoElement.style.display = 'flex';
        this.currentTodoEdit = element;
        this._toggleElementsForEditTodo(true);
    }

    async deleteTodo(element) {
        await this.itemClient.deleteTodo(element.id);
        await this.render();
    }

    _setSortBy() {
        const sortByOrder = this.localStorageManager.getSortBy();
        if (!sortByOrder) {
            return;
        }
        const options = Array.from(this.sortOrder.options);
        for (let i = 0; i < options.length; i++) {
            const element = options[i];
            if (sortByOrder == element.value) {
                this.sortOrder.selectedIndex = i;
                return;
            }
        }
    }

    _toggleElementsForEditTodo(disabled) {
        this.todoInput.disabled = typeof disabled == 'boolean' ? disabled : !this.todoInput.disabled;
        this.addBtn.disabled = typeof disabled == 'boolean' ? disabled : !this.addBtn.disabled;
        this.sortOrder.disabled = typeof disabled == 'boolean' ? disabled : !this.sortOrder.disabled;
        this.deleteAllBtn.disabled = typeof disabled == 'boolean' ? disabled : !this.deleteAllBtn.disabled;
    }

    closeAlertBox(event) {
        this.alertBox.classList.remove("show", this.ALERT_TYPE.WARNING, this.ALERT_TYPE.INFO);
    }

    showTaskDetails(element) {
        return `<span><span>To do:</span> ${element.message}</span></br>
      ${element.checked ? `Challange completed` : `Challange is yet completed`} `;
    }

    alert(alert, type) {
            this.alertBox.classList.add("show", type);
            this.alertBoxText.innerHTML = alert;
    }
}

const main = new Main();

document.addEventListener("DOMContentLoaded", async () => {
    main.init();
    await main.render();
});