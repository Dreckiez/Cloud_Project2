
const taskForm = document.getElementById('task-form');
const tasksContainer = document.getElementById('tasks-container');
const filterPriority = document.getElementById('filter-priority');
const filterDate = document.getElementById('filter-date');
const clearFiltersBtn = document.getElementById('clear-filters');
const activeTasksContainer = document.getElementById('active-tasks-container');
const completedTasksContainer = document.getElementById('completed-tasks-container');
const completedCount = document.getElementById('completed-count');
const modal = document.getElementById('task-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

const API_URL = 'http://localhost:3000/tasks'; 

let tasks = [];

// --- Event Listeners ---
taskForm.addEventListener('submit', handleCreateTask);
filterPriority.addEventListener('change', renderTasks);
filterDate.addEventListener('change', renderTasks);
clearFiltersBtn.addEventListener('click', clearFilters);


// --- Modal Elements & Logic ---
openModalBtn.addEventListener('click', () => {
    modal.classList.add('show');
});

closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('show');
    taskForm.reset();
}

// READ: Fetch all tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// CREATE: Add a new task
async function handleCreateTask(e) {
    e.preventDefault();
    
    const newTask = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value,
        dueDate: document.getElementById('dueDate').value,
        status: 'pending'
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
       
        taskForm.reset();
        closeModal();
        fetchTasks();
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

// UPDATE: Change task status or details
async function updateTask(taskId, updatedData) {
    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
       
        fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// DELETE: Remove a task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
       
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// --- UI Rendering & Filtering ---

function renderTasks() {
    // Clear both lists
    activeTasksContainer.innerHTML = ''; 
    completedTasksContainer.innerHTML = '';
    
    let doneCounter = 0;

    // Apply Filters
    const priorityFilter = filterPriority.value;
    const dateFilter = filterDate.value;
    
    const filteredTasks = tasks.filter(task => {
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesDate = !dateFilter || task.dueDate === dateFilter;
        return matchesPriority && matchesDate;
    });

    if (filteredTasks.length === 0) {
        activeTasksContainer.innerHTML = '<p>No tasks found.</p>';
        completedCount.textContent = '0';
        return;
    }

    // Build and route the cards
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item status-${task.status}`;
        
        taskElement.innerHTML = `
            <div>
                <h3>${task.title} <small>(${task.priority})</small></h3>
                <p>${task.description}</p>
                <small>Due: ${task.dueDate}</small>
            </div>
            <div class="task-actions">
                <button class="btn btn-secondary" onclick="updateTask('${task.taskId}', {status: '${task.status === 'pending' ? 'done' : 'pending'}'})">
                    ${task.status === 'pending' ? 'Mark Done' : 'Undo'}
                </button>
                <button class="btn btn-danger" onclick="deleteTask('${task.taskId}')">Delete</button>
            </div>
        `;

        // Route to the correct container
        if (task.status === 'done') {
            completedTasksContainer.appendChild(taskElement);
            doneCounter++;
        } else {
            activeTasksContainer.appendChild(taskElement);
        }
    });

    // Update the counter in the UI
    completedCount.textContent = doneCounter;
}

function clearFilters() {
    filterPriority.value = 'all';
    filterDate.value = '';
    renderTasks();
}

fetchTasks();