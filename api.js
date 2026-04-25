// api.js
const API_URL = 'YOUR_API_GATEWAY_URL_HERE/tasks';

export const api = {
    async fetchTasks() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    },

    async createTask(taskData) {
        console.log('API: Creating task...', taskData);
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
    },

    async updateTask(taskId, updatedData) {
        console.log(`API: Updating task ${taskId}...`, updatedData);
        await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
    },

    async deleteTask(taskId) {
        console.log(`API: Deleting task ${taskId}...`);
        await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
    }
};