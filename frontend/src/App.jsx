import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [deletingTodo, setDeletingTodo] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Failed to load todos')
      }

      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError('Unable to connect to the backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // Statistics
  const total = todos.length
  const completed = todos.filter((todo) => todo.completed).length
  const pending = todos.filter((todo) => !todo.completed).length

  const completionPercentage =
    total === 0 ? 0 : Math.round((completed / total) * 100)

  // Search + filter
  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.description.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && todo.completed) ||
        (filter === 'pending' && !todo.completed)

      return matchesSearch && matchesFilter
    })
  }, [todos, search, filter])

  // Open create form
  const openCreateForm = () => {
    setEditingTodo(null)
    setTitle('')
    setDescription('')
    setShowForm(true)
  }

  // Open edit form
  const openEditForm = (todo) => {
    setEditingTodo(todo)
    setTitle(todo.title)
    setDescription(todo.description)
    setShowForm(true)
  }

  // Close form
  const closeForm = () => {
    setShowForm(false)
    setEditingTodo(null)
    setTitle('')
    setDescription('')
  }

  // Create / Update
  const saveTodo = async (event) => {
    event.preventDefault()

    if (!title.trim()) return

    try {
      const todoData = {
        title: title.trim(),
        description: description.trim(),
        completed: editingTodo ? editingTodo.completed : false,
      }

      const url = editingTodo
        ? `${API_URL}/${editingTodo.id}`
        : API_URL

      const method = editingTodo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      })

      if (!response.ok) {
        throw new Error('Failed to save todo')
      }

      closeForm()
      fetchTodos()
    } catch (err) {
      setError('Unable to save the task.')
    }
  }

  // Complete / Undo
  const toggleTodo = async (todo) => {
    try {
      await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          completed: !todo.completed,
        }),
      })

      fetchTodos()
    } catch (err) {
      setError('Unable to update the task.')
    }
  }

  // Delete
  const deleteTodo = async () => {
    if (!deletingTodo) return

    try {
      await fetch(`${API_URL}/${deletingTodo.id}`, {
        method: 'DELETE',
      })

      setDeletingTodo(null)
      fetchTodos()
    } catch (err) {
      setError('Unable to delete the task.')
    }
  }

  return (
    <main className="app">
      <div className="container">

        {/* Header */}
        <header className="header">
          <div>
            <h1>Your tasks</h1>
            <p>A little progress every day adds up.</p>
          </div>

          <button className="add-main-button" onClick={openCreateForm}>
            <span>+</span>
            Add task
          </button>
        </header>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="stats">

          <div className="stat-card">
            <div>
              <p>Total tasks</p>
              <strong>{total}</strong>
            </div>
            <div className="stat-icon indigo">☷</div>
            <span>All your tasks</span>
          </div>

          <div className="stat-card">
            <div>
              <p>Completed</p>
              <strong>{completed}</strong>
            </div>
            <div className="stat-icon green">✓</div>
            <span>{completionPercentage}% of total</span>
          </div>

          <div className="stat-card">
            <div>
              <p>Pending</p>
              <strong>{pending}</strong>
            </div>
            <div className="stat-icon amber">◷</div>
            <span>Still to do</span>
          </div>

          <div className="stat-card">
            <div>
              <p>Progress</p>
              <strong>{completionPercentage}%</strong>
            </div>
            <div className="stat-icon purple">↗</div>
            <span>Keep going</span>
          </div>

        </section>

        {/* Task section */}
        <section className="task-section">

          {/* Toolbar */}
          <div className="toolbar">

            <div className="filters">
              <span className="filter-icon">☷</span>

              <button
                className={filter === 'all' ? 'active-filter' : ''}
                onClick={() => setFilter('all')}
              >
                All
                <span>{total}</span>
              </button>

              <button
                className={filter === 'pending' ? 'active-filter' : ''}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>

              <button
                className={filter === 'completed' ? 'active-filter' : ''}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

          </div>

          {/* Tasks */}
          <div className="task-list">

            {loading ? (
              <div className="empty-state">
                <h3>Loading tasks...</h3>
              </div>
            ) : visibleTodos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">☷</div>
                <h3>No tasks found</h3>
                <p>Create a task and stay organized.</p>

                <button onClick={openCreateForm}>
                  + Add task
                </button>
              </div>
            ) : (
              visibleTodos.map((todo) => (
                <div
                  className={`task-card ${
                    todo.completed ? 'task-completed' : ''
                  }`}
                  key={todo.id}
                >

                  <button
                    className={`checkbox ${
                      todo.completed ? 'checked' : ''
                    }`}
                    onClick={() => toggleTodo(todo)}
                  >
                    {todo.completed ? '✓' : ''}
                  </button>

                  <div className="task-content">

                    <h3>{todo.title}</h3>

                    <p>{todo.description}</p>

                    <span className="task-status">
                      {todo.completed ? 'Completed' : 'Pending'}
                    </span>

                  </div>

                  <div className="task-actions">

                    <button
                      className="edit-button"
                      onClick={() => openEditForm(todo)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => setDeletingTodo(todo)}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

        <p className="footer-text">
          Your tasks are stored in your MySQL database.
        </p>

      </div>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <span>Task details</span>
                <h2>
                  {editingTodo ? 'Edit task' : 'Create a new task'}
                </h2>
              </div>

              <button
                className="close-button"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveTodo}>

              <label>
                Task title

                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  autoFocus
                />
              </label>

              <label>
                Description

                <textarea
                  placeholder="Add a little more context..."
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows="4"
                />
              </label>

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingTodo ? 'Save changes' : 'Add task'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingTodo && (
        <div className="modal-overlay">

          <div className="delete-modal">

            <div className="delete-icon">
              🗑
            </div>

            <h2>Delete this task?</h2>

            <p>
              This will permanently remove "{deletingTodo.title}".
            </p>

            <div className="modal-buttons">

              <button
                className="cancel-button"
                onClick={() => setDeletingTodo(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={deleteTodo}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  )
}

export default App