import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/todos');
      const data = await res.json();
      setTodos(data);
    } catch (e) {
      alert('Error cargando tareas');
    }
    setLoading(false);
  };

  // Cambiar estado completado
  const toggleComplete = async (id, completed) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  // Eliminar tarea
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3001/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  // Guardar edición
  const saveEdit = async (id) => {
    if (!editText.trim()) {
      alert('El texto no puede estar vacío');
      return;
    }
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText }),
    });
    setEditingId(null);
    setEditText('');
    fetchTodos();
  };

  // Filtrar tareas
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div>
      <h2>Lista de Todos</h2>
      <div>
        <button onClick={() => setFilter('all')}>Todos</button>
        <button onClick={() => setFilter('completed')}>Completados</button>
        <button onClick={() => setFilter('pending')}>Pendientes</button>
        <button onClick={() => navigate('/add')}>Agregar Nuevo</button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {filteredTodos.map(todo => (
            <li key={todo.id} style={{ margin: '10px 0' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id, todo.completed)}
              />
              {editingId === todo.id ? (
                <>
                  <input
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(todo.id)}>Guardar</button>
                  <button onClick={() => setEditingId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <span style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    marginLeft: 8,
                    marginRight: 8
                  }}>
                    {todo.title}
                  </span>
                  <button onClick={() => {
                    setEditingId(todo.id);
                    setEditText(todo.title);
                  }}>Editar</button>
                  <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList