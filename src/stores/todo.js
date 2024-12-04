import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const isDev = process.env.NODE_ENV === 'development'
const API_BASE_URL = isDev ? '/vue-todo-list/api/todos' : null

// 生产环境下的数据操作
const prodAPI = {
  async getTodos() {
    const data = localStorage.getItem('todos-data')
    return data ? JSON.parse(data) : { tasks: [] }
  },

  async saveTodos(data) {
    localStorage.setItem('todos-data', JSON.stringify(data))
  },

  async addTask(task) {
    const data = await this.getTodos()
    data.tasks.unshift(task)
    await this.saveTodos(data)
    return task
  },

  async updateTask(id, updates) {
    const data = await this.getTodos()
    const taskIndex = data.tasks.findIndex((task) => task.id === id)
    if (taskIndex !== -1) {
      data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates }
      await this.saveTodos(data)
      return data.tasks[taskIndex]
    }
    throw new Error('Task not found')
  },

  async deleteTask(id) {
    const data = await this.getTodos()
    data.tasks = data.tasks.filter((task) => task.id !== id)
    await this.saveTodos(data)
    return { success: true }
  },
}

export const useTodoStore = defineStore('todo', () => {
  // 状态
  const todos = ref([])
  const inProgress = ref([])
  const completed = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // 从 localStorage 恢复状态
  const initializeFromStorage = () => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      const { todos: t, inProgress: ip, completed: c } = JSON.parse(savedTodos)
      todos.value = t
      inProgress.value = ip
      completed.value = c
    }
  }

  // 监听状态变化并保存到 localStorage
  watch(
    [todos, inProgress, completed],
    () => {
      localStorage.setItem(
        'todos',
        JSON.stringify({
          todos: todos.value,
          inProgress: inProgress.value,
          completed: completed.value,
        }),
      )
    },
    { deep: true },
  )

  // 计算属性
  const todoCount = computed(() => todos.value.length)
  const inProgressCount = computed(() => inProgress.value.length)
  const completedCount = computed(() => completed.value.length)

  // API 方法
  async function fetchTodos() {
    try {
      isLoading.value = true
      error.value = null

      let data
      if (isDev) {
        const response = await fetch(API_BASE_URL, {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('Failed to fetch todos')
        data = await response.json()
      } else {
        data = await prodAPI.getTodos()
      }

      todos.value = data.tasks.filter((todo) => todo.status === 'todo')
      inProgress.value = data.tasks.filter((todo) => todo.status === 'inProgress')
      completed.value = data.tasks.filter((todo) => todo.status === 'completed')
    } catch (e) {
      error.value = e.message
      console.error('Error fetching todos:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function startTodo(id) {
    await updateTodoStatus(id, 'inProgress')
    fetchTodos()
  }

  async function completeTodo(id) {
    await updateTodoStatus(id, 'completed')
    fetchTodos()
  }

  async function addTodo(todo) {
    try {
      const newTodo = {
        ...todo,
        id: uuidv4(),
        status: 'todo',
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
      }

      if (isDev) {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo),
        })
        if (!response.ok) throw new Error('Failed to add todo')
      } else {
        await prodAPI.addTask(newTodo)
      }

      todos.value.unshift(newTodo)
      return newTodo
    } catch (e) {
      error.value = e.message
      console.error('Error adding todo:', e)
      return null
    }
  }

  async function removeTodo(id) {
    try {
      if (isDev) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete todo')
      } else {
        await prodAPI.deleteTask(id)
      }

      todos.value = todos.value.filter((todo) => todo.id !== id)
      inProgress.value = inProgress.value.filter((todo) => todo.id !== id)
      completed.value = completed.value.filter((todo) => todo.id !== id)
    } catch (e) {
      error.value = e.message
      console.error('Error removing todo:', e)
    }
  }

  async function updateTodoStatus(id, newStatus) {
    try {
      if (isDev) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })
        if (!response.ok) throw new Error('Failed to update todo')
      } else {
        await prodAPI.updateTask(id, { status: newStatus })
      }
      return true
    } catch (e) {
      error.value = e.message
      console.error('Error updating todo:', e)
      return false
    }
  }

  // 创建测试数据
  function createRandomTodos(len = 10) {
    for (let i = 0; i < len; i++) {
      addTodo({
        title: `Todo ${i + 1}`,
        description: `Description of Todo ${i + 1}`,
        image: 'https://via.placeholder.com/150',
      })
    }
  }

  return {
    todos,
    inProgress,
    completed,
    isLoading,
    error,
    todoCount,
    inProgressCount,
    completedCount,
    fetchTodos,
    addTodo,
    removeTodo,
    startTodo,
    completeTodo,
    updateTodoStatus,
    createRandomTodos,
    initializeFromStorage,
  }
})
