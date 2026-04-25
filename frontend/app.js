
import { taskService } from "./service.js";

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

async function initApp() {
    await taskService.loadTasks();
    renderTasks();
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

    await taskService.addTask(newTask);
    taskForm.reset();
    closeModal();
    renderTasks();
}

window.updateTask = async (taskId, currentStatus) => {
    await taskService.toggleTaskStatus(taskId, currentStatus);
    renderTasks();
};

window.deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    await taskService.removeTask(taskId);
    renderTasks();
};

// --- UI Rendering & Filtering ---

function renderTasks() {
    // Clear both lists
    activeTasksContainer.innerHTML = ''; 
    completedTasksContainer.innerHTML = '';
    
    const filteredTasks = taskService.getFilteredTasks(filterPriority.value, filterDate.value);
    let doneCounter = 0;

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
                <button class="btn btn-secondary" onclick="updateTask('${task.taskId}', '${task.status}')">
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

initApp();