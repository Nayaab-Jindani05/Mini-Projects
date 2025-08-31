import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Todo from '../components/Todo';

const getTodos = () => {
  let todos = localStorage.getItem('todos');
  if (todos) {
    return JSON.parse(todos);
  }
  return [];
};

const Home = () => {
  const [todos, setTodos] = useState(getTodos());
  const [todo, setTodo] = useState('');
  const [filter, setFilter] = useState('all'); // New filter state

  const addTodo = (e) => {
    e.preventDefault();
    if (todo && todos.findIndex(t => t.text === todo) === -1) {
      setTodos(prev => [
        ...prev,
        { id: nanoid(), text: todo, date: new Date().toISOString() } // Added date field
      ]);
      setTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const moveUp = (id) => {
    let index = todos.findIndex(t => t.id === id);
    if (index > 0) {
      let temp = todos[index];
      todos[index] = todos[index - 1];
      todos[index - 1] = temp;
      setTodos([...todos]);
    }
  };

  const moveDown = (id) => {
    let index = todos.findIndex(t => t.id === id);
    if (index < todos.length - 1) {
      let temp = todos[index];
      todos[index] = todos[index + 1];
      todos[index + 1] = temp;
      setTodos([...todos]);
    }
  };

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    const todoDate = new Date(todo.date);
    const now = new Date();

    if (filter === 'today') {
      return (
        todoDate.getDate() === now.getDate() &&
        todoDate.getMonth() === now.getMonth() &&
        todoDate.getFullYear() === now.getFullYear()
      );
    }

    if (filter === 'thisWeek') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      return todoDate >= startOfWeek && todoDate <= endOfWeek;
    }

    return true;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <div className='home'>
      <div className='container'>
        <form className='todo-form' onSubmit={addTodo}>
          <input
            type="text"
            placeholder='Add item...'
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <input
            type='button'
            onClick={addTodo}
            className='btn-addTodo'
            value='Add'
          />
        </form>

        {/* Filter UI */}
        <div style={{ margin: '10px 0', textAlign: 'center' }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
          </select>
        </div>

        {filteredTodos.length ? (
          <div className='todo-list'>
            {filteredTodos.map((todo, index) => (
              <Todo
                key={todo.id}
                todo={todo}
                deleteTodo={deleteTodo}
                moveUp={moveUp}
                moveDown={moveDown}
                total={filteredTodos.length}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
            No todo...
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
