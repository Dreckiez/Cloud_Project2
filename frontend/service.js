// service.js
import { api } from './api.js';

let tasks = [];

export const taskService = {
    async loadTasks() {
        try {
            tasks = await api.fetchTasks();
            return tasks;
        } catch (error) {
            console.error('Error in taskService.loadTasks:', error);
            return [];
        }
    },

    getFilteredTasks(priorityFilter, dateFilter) {
        return tasks.filter(task => {
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesDate = !dateFilter || task.dueDate === dateFilter;
            return matchesPriority && matchesDate;
        });
    },

    async addTask(taskData) {
        await api.createTask(taskData);
        await this.loadTasks(); // Refresh state
    },

    async toggleTaskStatus(taskId, currentStatus) {
        const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
        await api.updateTask(taskId, { status: newStatus });
        await this.loadTasks();
    },

    async removeTask(taskId) {
        await api.deleteTask(taskId);
        await this.loadTasks();
    }
};