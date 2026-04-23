// DOM Elements
const taskForm = document.getElementById('task-form');
const tasksContainer = document.getElementById('tasks-container');
const filterPriority = document.getElementById('filter-priority');
const filterDate = document.getElementById('filter-date');
const clearFiltersBtn = document.getElementById('clear-filters');
const activeTasksContainer = document.getElementById('active-tasks-container');
const completedTasksContainer = document.getElementById('completed-tasks-container');
const completedCount = document.getElementById('completed-count');

// API Base URL (You will replace this with your API Gateway URL later)
const API_URL = 'YOUR_API_GATEWAY_URL_HERE/tasks'; 

// Temporary local state to handle filtering
let tasks = [];

// --- Event Listeners ---
taskForm.addEventListener('submit', handleCreateTask);
filterPriority.addEventListener('change', renderTasks);
filterDate.addEventListener('change', renderTasks);
clearFiltersBtn.addEventListener('click', clearFilters);


// --- Modal Elements & Logic ---
const modal = document.getElementById('task-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

openModalBtn.addEventListener('click', () => {
    modal.classList.add('show');
});

closeModalBtn.addEventListener('click', closeModal);

// Close if user clicks outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('show');
    taskForm.reset(); // Optional: clears form when closed
}

// --- CRUD Operations ---

// READ: Fetch all tasks
async function fetchTasks() {
    try {
        // const response = await fetch(API_URL);
        // tasks = await response.json();
        
        // Mock data for local testing before API is ready
        tasks = [
            { taskId: '1', title: 'Setup AWS VPC', description: 'Create custom VPC and subnets', priority: 'high', dueDate: '2026-05-01', status: 'pending' },
            { taskId: '2', title: 'Write IAM Roles', description: 'Configure least privilege policies', priority: 'medium', dueDate: '2026-05-02', status: 'done' }
        ];
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
        status: 'pending' // Default status
    };

    try {
        /* Uncomment when API is ready
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        */
        console.log('Task Created:', newTask);
        taskForm.reset();
        closeModal();
        fetchTasks(); // Refresh list
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

// UPDATE: Change task status or details
async function updateTask(taskId, updatedData) {
    try {
        /* Uncomment when API is ready
        await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        */
        console.log(`Task ${taskId} updated`);
        fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// DELETE: Remove a task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        /* Uncomment when API is ready
        await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
        */
        console.log(`Task ${taskId} deleted`);
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

    // Apply Filters (Keep your existing filter logic here)
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

// Initial load
fetchTasks();