import http from 'http';
import { randomUUID } from 'crypto';

let tasks = [
    { taskId: '1', title: 'Setup AWS VPC', description: 'Create custom VPC and subnets', priority: 'high', dueDate: '2026-05-01', status: 'pending' },
    { taskId: '2', title: 'Write IAM Roles', description: 'Configure least privilege policies', priority: 'medium', dueDate: '2026-05-02', status: 'done' }
];

const PORT = 3000;

// Create the raw HTTP server
const server = http.createServer((req, res) => {
    
    // 1. Handle CORS (Cross-Origin Resource Sharing)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // The browser automatically sends an OPTIONS request before a POST/PUT/DELETE to check permissions
    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    // 2. Routing logic (Replacing Express app.get, app.post, etc.)
    
    // GET /tasks - Read all tasks
    if (req.method === 'GET' && req.url === '/tasks') {
        res.writeHead(200, headers);
        res.end(JSON.stringify(tasks));
    }
    
    // POST /tasks - Create a new task
    else if (req.method === 'POST' && req.url === '/tasks') {
        let body = '';
        
        // Listen for data chunks (Replacing express.json())
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        // When all data is received
        req.on('end', () => {
            const requestBody = JSON.parse(body);
            
            const newTask = {
                taskId: randomUUID(),
                title: requestBody.title,
                description: requestBody.description || "",
                priority: requestBody.priority || "medium",
                dueDate: requestBody.dueDate,
                status: "pending"
            };
            
            tasks.push(newTask);
            
            res.writeHead(201, headers);
            res.end(JSON.stringify(newTask));
        });
    }
    
    // PUT /tasks/:id - Update a task (e.g., /tasks/1)
    else if (req.method === 'PUT' && req.url.startsWith('/tasks/')) {
        const id = req.url.split('/')[2]; // Extract ID from URL
        let body = '';
        
        req.on('data', chunk => { body += chunk.toString(); });
        
        req.on('end', () => {
            const updateData = JSON.parse(body);
            const taskIndex = tasks.findIndex(t => t.taskId === id);
            
            if (taskIndex !== -1) {
                // Merge existing task with updated fields
                tasks[taskIndex] = { ...tasks[taskIndex], ...updateData };
                res.writeHead(200, headers);
                res.end(JSON.stringify(tasks[taskIndex]));
            } else {
                res.writeHead(404, headers);
                res.end(JSON.stringify({ message: 'Task not found' }));
            }
        });
    }
    
    // DELETE /tasks/:id - Delete a task
    else if (req.method === 'DELETE' && req.url.startsWith('/tasks/')) {
        const id = req.url.split('/')[2];
        const initialLength = tasks.length;
        
        tasks = tasks.filter(t => t.taskId !== id);
        
        if (tasks.length < initialLength) {
            res.writeHead(200, headers);
            res.end(JSON.stringify({ message: `Task ${id} deleted` }));
        } else {
            res.writeHead(404, headers);
            res.end(JSON.stringify({ message: 'Task not found' }));
        }
    }
    
    // Catch-all for unknown routes (Replacing app.use(404))
    else {
        res.writeHead(404, headers);
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Vanilla Node.js server running on http://localhost:${PORT}`);
});