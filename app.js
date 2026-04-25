// app.js
import { taskService } from './service.js';

// DOM Elements
const taskForm = document.getElementById('task-form');
const filterPriority = document.getElementById('filter-priority');
const filterDate = document.getElementById('filter-date');
const clearFiltersBtn = document.getElementById('clear-filters');
const activeTasksContainer = document.getElementById('active-tasks-container');
const completedTasksContainer = document.getElementById('completed-tasks-container');
const completedCount = document.getElementById('completed-count');
const modal = document.getElementById('task-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

// --- Initialization ---
async function init() {
    await taskService.loadTasks();
    renderUI();
}

// --- Event Listeners ---
taskForm.addEventListener('submit', async (e) => {
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
    renderUI();
});

filterPriority.addEventListener('change', renderUI);
filterDate.addEventListener('change', renderUI);
clearFiltersBtn.addEventListener('click', () => {
    filterPriority.value = 'all';
    filterDate.value = '';
    renderUI();
});

// Expose these to the global window object so inline HTML onclick handlers still work
window.handleStatusToggle = async (taskId, currentStatus) => {
    await taskService.toggleTaskStatus(taskId, currentStatus);
    renderUI();
};

window.handleDelete = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
        await taskService.removeTask(taskId);
        renderUI();
    }
};

// --- Modal Logic ---
openModalBtn.addEventListener('click', () => modal.classList.add('show'));
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('show');
    taskForm.reset();
}

// --- UI Rendering ---
function renderUI() {
    activeTasksContainer.innerHTML = ''; 
    completedTasksContainer.innerHTML = '';
    let doneCounter = 0;

    const filteredTasks = taskService.getFilteredTasks(filterPriority.value, filterDate.value);

    if (filteredTasks.length === 0) {
        activeTasksContainer.innerHTML = '<p>No tasks found.</p>';
        completedCount.textContent = '0';
        return;
    }

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
                <button class="btn btn-secondary" onclick="handleStatusToggle('${task.taskId}', '${task.status}')">
                    ${task.status === 'pending' ? 'Mark Done' : 'Undo'}
                </button>
                <button class="btn btn-danger" onclick="handleDelete('${task.taskId}')">Delete</button>
            </div>
        `;

        if (task.status === 'done') {
            completedTasksContainer.appendChild(taskElement);
            doneCounter++;
        } else {
            activeTasksContainer.appendChild(taskElement);
        }
    });

    completedCount.textContent = doneCounter;
}

init();