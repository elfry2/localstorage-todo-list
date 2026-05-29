'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const STORAGE_KEY = 'apple_hig_todos';

    // State management array
    let todos = [];

    // Initialise app by reading from localStorage
    const init = () => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if(stored) {
            try {
                todos = JSON.parse(stored);
            }

            catch (e) {
                console.error('Failed to parse todos from localStorage', e);
                todos = [];
            }
        }

        render();
    }

    // Save current state to localStorage
    const saveTodos = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }    

    // Generate a unique ID for each task
    const generateId = () => {
        return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // Create DOM elements programmatically
    const createTodoElement = (todo) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.complete ? 'incomplete' : 'complete'}`);

        // Handle checking/unchecking
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            saveTodos();
            render();
        });

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        // textContent escapes HTML entities safely
        textSpan.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', `Delete "${todo.text}"`);

        // Handle deletion
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(t => t.id !== todo.id);
            saveTodos();
            render();
        });

        li.append(checkbox, textSpan, deleteBtn);
        return li;
    }

    const render = () => {
        list.innerHTML = '';

        if(todos.length === 0) {
            list.style.display = 'none';
            return;
        }

        list.style.display = 'block';
        const fragment = document.createDocumentFragment();

        todos.forEach((todo) => {
            fragment.appendChild(createTodoElement(todo));
        });

        list.appendChild(fragment);
    }

    // Form submission handler 
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();

        if(text) {
            // Update state
            todos.push({
                id: generateId(),
                text: text,
                completed: false,
            });

            // Save and update UI
            saveTodos();
            render();

            // Reset input
            input.value = '';
            input.focus();
        }
    });

    init();
});