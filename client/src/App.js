// src/App.js

import React, { useState, useEffect } from 'react';
import config from './config';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        fetch(`${config.apiUrl}/api/todos`)
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((error) => {
                console.error('Error fetching todos:', error);
                setTodos([]);
            });
    };

    const handleAddTodo = () => {
        fetch(`${config.apiUrl}/api/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newTodo }),
        })
            .then((res) => res.json())
            .then((data) => {
                setTodos([...todos, data]);
                setNewTodo('');
            })
            .catch((error) => console.error('Error adding todo:', error));
    };

    const handleDeleteTodo = (id) => {
        fetch(`${config.apiUrl}/api/todos/${id}`, {
            method: 'DELETE',
        })
            .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
            .catch((error) => console.error('Error deleting todo:', error));
    };

    const handleToggleComplete = (id, completed) => {
        fetch(`${config.apiUrl}/api/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !completed }),
        })
            .then((res) => res.json())
            .then((data) => {
                setTodos(todos.map((todo) => (todo._id === id ? data : todo)));
            })
            .catch((error) => console.error('Error toggling complete:', error));
    };

    return (
        <div className="App">
            <h1>MERN Todo App</h1>
            <div>
                <input
                    type="text"
                    placeholder="New Todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button onClick={handleAddTodo}>Add Todo</button>
            </div>
            <ul>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.text}
                        </span>
                        <button onClick={() => handleToggleComplete(todo._id, todo.completed)}>
                            Toggle Complete
                        </button>
                        <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
