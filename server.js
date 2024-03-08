const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/todo');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/mern-demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// Routes

// Root route
app.get('/', (req, res) => {
    res.send('Hello MERN!');
});

// API Endpoints

// Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific todo by ID
app.get('/api/todos/:id', getTodo, (req, res) => {
    res.json(res.todo);
});

// Update a todo by ID
app.patch('/api/todos/:id', getTodo, async (req, res) => {
    if (req.body.text !== null) {
        res.todo.text = req.body.text;
    }
    if (req.body.completed !== null) {
        res.todo.completed = req.body.completed;
    }

    try {
        const updatedTodo = await res.todo.save();
        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a todo by ID
app.delete('/api/todos/:id', getTodo, async (req, res) => {
    try {
        await res.todo.remove();
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to get a specific todo by ID
async function getTodo(req, res, next) {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.todo = todo;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
