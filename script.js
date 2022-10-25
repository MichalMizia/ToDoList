// const lists = []
// const addListForm = document.getElementById('addListForm')
// const deleteListForm = document.getElementById('delete-list')
// const addListInput = document.getElementById('addListInput')
// const listOfLists = document.querySelector('.list-of-lists')

// function addList(listName){
//   const li = document.createElement('li')
//   li.classList.add('single-list');
//   li.innerHTML = listName
  
//   listOfLists.appendChild(li);
//   lists.push(listName);

//   const listItems = document.querySelectorAll('.single-list');
//   listItems.forEach( (listItem) =>{
//     listItem.removeAttribute('id');
//   })
//   li.id = 'current-list';

//   // create a new list of todos
//   const toDoList = document.createElement('div');
//   toDoList.id = 'toDoList';
//   toDoList.classList.add(listName, 'current', 'toDoList');
//   console.log(toDoList.classList);
//   document.querySelector('.toDo-list').appendChild(toDoList);
// }

// addListForm.onsubmit = (event) => {
//     addList(addListInput.value);
//     event.preventDefault()
// }

// // function changeActiveList

// function deleteList(listName){
//     const index = lists.indexOf(listName);
//     lists.remove(listName);
    
//     const li = document.getElementById('current-list');
//     li.remove();
//   }


//   // single list
//   const todos = []
//   const clearCompleted = document.getElementById('clear');
//   const toDoList = document.getElementById('toDoList');
//   const addToDoForm = document.getElementById('addToDoForm');
//   const addToDoInput = document.getElementById('addToDoInput');

//   const tasksRemaining = document.getElementById('tasks-remaining');

//   function addToDo(todoText){
//     todos.push(todoText);
//     const label = document.createElement('label');
//     label.classList.add('list-item__container');
//     const input = document.createElement("input");
//     input.classList.add('toDoCheckbox');
//     input.type = 'checkbox'
//     const text = document.createElement('div');
//     text.innerHTML = todoText;
//     text.classList.add('label');
    
//     label.appendChild(input);
//     label.appendChild(text);
//     toDoList.appendChild(label);

//     tasksRemaining.innerHTML = todos.length
//   }

//   addToDoForm.onsubmit = (event) => {
//     addToDo(addToDoInput.value);
//     event.preventDefault();
// }

// // clear completed list items
// clearCompleted.addEventListener('click', ()=> {
//     const checkboxes = document.querySelectorAll('.toDoCheckbox');
//     checkboxes.forEach( (checkbox) =>{
//         if(checkbox.checked){
//             text = checkbox.parentElement.querySelector('.label').innerHTML;
//             checkbox.parentElement.remove();
//             todos.splice(todos.indexOf(text), 1);
//         }
//     })
//     tasksRemaining.innerHTML = todos.length;
// })
const LOCAL_STORAGE_LIST_KEY = 'tasks.list'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'tasks.selectedListID'

const toDoLists = document.getElementById('toDoLists')
const addListInput = document.getElementById('addListInput');
const addListForm = document.getElementById('addListForm');
const deleteListButton = document.getElementById('delete-list');
const tasksRemaining = document.getElementById('tasksRemaining');
const toDoTitle = document.getElementById('toDoTitle');
const todos = document.getElementById('todos');
const addTodoForm = document.getElementById('addTodoForm');
const addTodoInput = document.getElementById('addTodoInput');
const toDoList = document.getElementById('toDoList'); 
const clearComplete = document.getElementById('clear');

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListID = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

toDoLists.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li'){
        selectedListID = e.target.dataset.listId;
        saveAndRender();
        renderTodos();
    }
})

deleteListButton.addEventListener('click', ()=>{
    lists = lists.filter(list => list.id !== selectedListID);
    selectedListID = null;
    saveAndRender();
    renderTodos();
})

function render(){
    clearElement(toDoLists);
    lists.forEach( list =>{
        const singleList = document.createElement('li');
        singleList.innerHTML = list.name;
        singleList.dataset.listId = list.id;
        if(list.id === selectedListID){
            singleList.classList.add('current-list')
            toDoTitle.innerHTML = list.name;
        }
        toDoLists.appendChild(singleList);
    })
    if(selectedListID == null || selectedListID == undefined){
        todos.style.setProperty('display', 'none')
    }else{
        todos.style.setProperty('display', 'block')
    }
}

function clearElement(element){
    while (element.firstChild){
        element.removeChild(element.firstChild)
    }
}

function saveAndRender(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListID)
    render();
}

function renderTodos(){
    clearElement(toDoList);

    if(selectedListID == null || selectedListID == undefined) return;
    const currentList = lists.find(list => list.id === selectedListID)
    let numTasks = 0;
    currentList.tasks.forEach( task =>{
        const todo = document.createElement('label');
        todo.classList.add('list-item__container');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.dataset.taskID = task.id;
        const text = document.createElement('span');
        text.classList.add('label');
        text.innerHTML = task.name;
        todo.appendChild(input);
        todo.appendChild(text);
        toDoList.appendChild(todo);
        if(!task.complete){
            numTasks++
        }else{
           input.checked = true; 
        }
    })
    
    const tasksString = numTasks == 1 ? 'task' : "tasks";
    tasksRemaining.innerText = `${numTasks} ${tasksString} remaining`
    
    
}

addListForm.addEventListener('submit', e=>{
    e.preventDefault();
    const listName = addListInput.value;
    if(listName == null || listName === '') return
    const list = createList(listName);
    lists.push(list);
    addListInput.value = '';
    saveAndRender();
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

addTodoForm.addEventListener('submit', e=>{
    e.preventDefault();
    const taskName = addTodoInput.value;
    if(taskName == null || taskName === '') return
    const task = createTask(taskName);
    const currentList = lists.find(list => list.id === selectedListID)
    
    currentList.tasks.push(task);
    addTodoInput.value = '';
    saveAndRender(); 
    renderTodos()   
})

function createTask(name){
    return {id: selectedListID + Date.now().toString(), name: name, complete: false}
}

toDoList.addEventListener('click', e =>{
    if(e.target.tagName.toLowerCase() === 'input'){
        const taskID = e.target.dataset.taskID;
        const currentList = lists.find(list => list.id === selectedListID)
        const currentTask = currentList.tasks.find(task => task.id === taskID);
        currentTask.complete = !currentTask.complete;
        console.log(currentTask.complete)

        let numTasks = 0;
        currentList.tasks.forEach( task =>{
            if(!task.complete){
                numTasks++
            }
        })
    
        const tasksString = numTasks == 1 ? 'task' : "tasks";
        tasksRemaining.innerText = `${numTasks} ${tasksString} remaining`;
    }
    saveAndRender();
})

clearComplete.addEventListener('click', ()=>{
    const currentList = lists.find(list => list.id === selectedListID)
    currentList.tasks = currentList.tasks.filter(task => task.complete == false);
    currentList.tasks.forEach(task =>{
        task.complete = false;
    })
    saveAndRender();
    renderTodos();
})

saveAndRender();
renderTodos();