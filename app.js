/* -- Show / Hide App Guide -- */

const appGuide = document.querySelector('.app-guide');

function showGuide() { appGuide.classList.add('show') };

function hideGuide() { appGuide.classList.remove('show') };

/*
    -- Some Local Storage Stuff -- 
    ! LS = Local Storage 
*/

let arrayOfTasks = [];

// Check If There Is Tasks In The 'Local Storage'
if (localStorage.getItem("tasks")) {
    arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
};

/* -- Create The setTask() Function -- */

// Main Elements & Settings
const tasksContainer = document.querySelector('.tasks');
const taskInput = document.getElementById('task-input');
let allowedTasks = 20;
let tasksCount = 0;

// Execute 'setTask()' When Press 'Enter' In The Keyboard 
taskInput.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        setTask();
    };
});

function setTask() {

    // Get The Added Task From The User
    const taskContent = taskInput.value;
    
    // Handle If The User Doesn't Write Anything
    if (taskContent === '') {
        tasksContainer.innerHTML = `
            <h3 class="alert-text">Input mustn't be empty!</h3>
        `;
        return;
    }

    // Clear any previous alerts
    const alert = document.querySelector('.alert-text');
    if (alert) alert.remove();

    // Increase Tasks Count By 1
    tasksCount++;

    // Create The 'Task Object'
    const taskObj = {
        id: Date.now(),
        content: taskContent,
        pending: true,
        completed: false,
    };

    // Push The 'Task Object' To The 'arrayOfTasks'
    arrayOfTasks.push(taskObj);

    // Trigger The addDataToLS() Function
    addDataToLS(JSON.stringify(arrayOfTasks));

    // Trigger The showTasks() Function
    showTasks(arrayOfTasks);

    // Clear the input after adding the task
    taskInput.value = '';

    // Call The 'checker' 
    checker();

    // Check If The User Reach The 'allowedTasks' Number
    if (allowedTasks === tasksCount) {
        tasksContainer.innerHTML = `
            <div class="error-box">
                <img src="assets/error.png">
                <h3 class="alert-text">You reach the allowed tasks limit.</h3>  
            </div>
        `;
    };

};

getDataFromLS();

/* -- Create The checker() Function -- */

function checker() {

    // Check If There Is No Added Tasks
    if (tasksContainer.children.length === 0) {
        tasksContainer.innerHTML = `
            <h3 class="alert-text">You don't have any tasks here.</h3>  
        `;
    };

};

document.addEventListener('DOMContentLoaded', checker);

/* -- Create The showMenu() Function -- */

function showMenu(selectedEl) {

    // Select The Task Box
    const taskBox = selectedEl.parentElement;
    
    // Select The Task Menu
    const taskMenu = taskBox.querySelector('.task-menu');

    // Toggle The 'show' Class 
    taskMenu.classList.toggle('show');

}

/* -- Create The editTask() Function -- */

const updateBtn = document.getElementById('update-btn');

function editTask(editBtn) {

    // Get The Specified 'Task Box'
    const taskBox = editBtn.parentElement.parentElement;

    // Get The Old 'Task Content'
    let oldTaskContent = taskBox.querySelector('.task-content').textContent;

    // Add The 'Old Task Content' To The 'Task Input'
    taskInput.value = oldTaskContent;

    // Focus On The 'Task Input'
    taskInput.focus();

    // Show The 'updateBtn'
    updateBtn.classList.add('show');

    // Execute The 'updateStatus()'
    updateBtn.addEventListener('click', function () { updateStatus(taskBox) });

    /* -- Create The updateStatus() Function -- */

    function updateStatus(taskBox) {

        // Get The New Added Task
        let newTaskContent = taskInput.value;

        // Add The 'New Task Content' 
        taskBox.querySelector('.task-content').textContent = newTaskContent;

        // Hide The 'updateBtn'
        setTimeout(() => {
            updateBtn.classList.remove('show');
        }, 1000);

        // Get The Specified Task Id
        let taskId = taskBox.dataset.id;

        // Search For The Specified 'Task Object' In 'LS' & Change Its 'content' Property 
        arrayOfTasks.forEach(taskObj => {
            if (taskObj.id == taskId) {
                taskObj.content = newTaskContent;
            };
        });

        addDataToLS(JSON.stringify(arrayOfTasks));

        // Clear the input after update process
        taskInput.value = '';

    };

};  

/* -- Create The removeTask() Function -- */

function removeTask(removeBtn) {

    // Get The Specified 'Task Box'
    const taskBox = removeBtn.parentElement.parentElement;

    // Remove The Specified 'Task Box'
    taskBox.remove();

    // Call The 'checker'
    checker();

    // Get The 'Id' Of The Specified 'Task Box'
    let taskId = taskBox.dataset.id;

    // Remove The The Specified 'Task Object' From The 'arrayOfTasks'
    arrayOfTasks = arrayOfTasks.filter(taskObj => taskObj.id != taskId);

    addDataToLS(JSON.stringify(arrayOfTasks));

};

/* -- Create The clearAll() Function -- */

// Get The Clear Button
const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', clearAll);

function clearAll() {

    // Check If There Is Added Tasks 
    if (tasksContainer.children.length > 0) { 

        // Empty The 'tasksContainer' 
        tasksContainer.innerHTML = '';

        checker();

        // Remove All The Added Tasks In The 'arrayOfTasks'
        arrayOfTasks.length = 0;

        // Clear The 'Local Storage'
        localStorage.removeItem('tasks');

    };

};

/* -- Manage Filters Work -- */

// Select All The Filters | As An Array
const filters = Array.from(document.querySelectorAll('.filter'));

// Loop Through The 'filters' & Handle Click Event
filters.forEach(filter => {
    filter.addEventListener('click', function (e) {

        // Remove 'active' Class From All The Filters
        filters.forEach(filter => {
            filter.classList.remove('active');
        });

        // Add 'active' Class To The Clicked Filter
        e.currentTarget.classList.add('active');

        // Check If There Is Added Tasks
        if (tasksContainer.children.length > 0) {
            pendingTask();
            filterTasks(e.currentTarget);
        }

    });
});

/* -- Create The filterTasks() Function -- */

function filterTasks(filterEl) {

    // Get All The Exist Tasks
    const allTasks = Array.from(document.querySelectorAll('.task-box'));

    // Hide All The Exist Tasks
    allTasks.forEach(taskBox => { taskBox.style.display = 'none' });

    // Get The Value Of The 'data-filter' Attribute
    let dataFilter = filterEl.dataset.filter;

    // Select All The Elements That Has The 'dataFilter' As A Class
    const filtredTasks = Array.from(document.querySelectorAll(`.${dataFilter}`));

    // Show All The Filtred Tasks
    filtredTasks.forEach(taskBox => { taskBox.style.display = 'flex' });

};

/* -- Create The completeTask() Function -- */

function completeTask(completeCbx) {

    // Get The Specified Task Box
    const taskBox = completeCbx.parentElement;

    // Toggle The 'completed' Class To The Specified Task Box
    taskBox.classList.toggle('completed');

    // Get The Specified Task Id
    let taskId = taskBox.dataset.id;
    
    // Search For The Specified Task Object In The 'arrayOfTasks' In The 'LS'
    arrayOfTasks.forEach(taskObj => {

        if (taskObj.id == taskId) {

            // Update The 'completed' & 'pending' Properties of The Specified Task Object
            if (taskBox.classList.contains('completed')) { 
                taskObj.completed = true;
                taskObj.pending = false;
            } else {
                taskObj.completed = false;
                taskObj.pending = true;
            };
            
        };

    });

    // Return The Updated 'arrayOfTasks' To The Local Storage 
    addDataToLS(JSON.stringify(arrayOfTasks));

};

/* -- Create The pendingTask() Function -- */

function pendingTask() {

    // Get All The Exist Tasks
    const allTasks = Array.from(document.querySelectorAll('.task-box'));

    // Check For Tasks Classes 
    const pendingTasks = allTasks.filter((task) => { return !task.classList.contains('completed')});

    // Loop Through The Filtered Array And Add The 'pending' Class To It
    pendingTasks.forEach((task) => task.classList.add('pending') );

};

/* 
    - Local Storage & Its Functions 
*/


function addDataToLS(arrayOfTasks) { localStorage.setItem('tasks', arrayOfTasks) };

function getDataFromLS() {

    // Get The Data Stored In The 'LS'
    let data = localStorage.getItem('tasks');

    // Check And Get The 'Tasks Array'
    if (data) {
        const tasks = JSON.parse(data);
        showTasks(tasks);
    };

};


// The Function That Create The Tasks Depand On The Data Got From The Local Storage
function showTasks(arrayOfTasks) {

    // Empty The 'Tasks Container'
    tasksContainer.innerHTML = '';

    // Loop Through The 'Array Of Tasks'
    arrayOfTasks.forEach(taskObj => {

        // Create The HTML Markup Of The Task
        const taskHTML = `
            <div class="task-box all ${taskObj.completed ? 'completed' : ''}" data-id="${taskObj.id}">
                <input type="checkbox" id="completed-cbx-${taskObj.id}">
                <label onclick="completeTask(this)" for="completed-cbx-${taskObj.id}">
                    <i class="fa-solid fa-check"></i>
                </label>
                <p class="task-content">${taskObj.content}</p>
                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis" id="show-menu"></i>
                <ul class="task-menu">
                    <li onclick="editTask(this)">
                        <i class="fa-solid fa-pencil"></i>
                        <span>Edit</span>
                    </li>
                    <li onclick="removeTask(this)">
                        <i class="fa-regular fa-trash-can"></i>
                        <span>Delete</span>
                    </li>
                </ul>
            </div>
        `;

        // Append The 'Task' To The 'Tasks Container'
        tasksContainer.insertAdjacentHTML('beforeend', taskHTML);

    });

};

