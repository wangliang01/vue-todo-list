import fs from 'fs/promises'
import path from 'path'

// 读取 mock 数据
async function readMockData() {
  try {
    const filePath = path.resolve('public/mock/todos.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading mock data:', error)
    return { tasks: [] }
  }
}

// 写入 mock 数据
async function writeMockData(data) {
  try {
    const filePath = path.resolve('public/mock/todos.json')
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing mock data:', error)
  }
}

// 解析请求体
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

// mock API 插件
export function mockApiPlugin() {
  return {
    name: 'mock-api',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 解析 URL
          const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
          console.log('Middleware executed')
          console.log('Full URL:', parsedUrl.toString())
          console.log('Pathname:', parsedUrl.pathname)
          console.log('Method:', req.method)

          // 只处理 /api/todos 相关的请求
          if (!parsedUrl.pathname.startsWith('/api/todos')) {
            console.log('Not an API request, passing to next middleware')
            return next()
          }

          // 设置响应头
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

          // 处理 OPTIONS 请求
          if (req.method === 'OPTIONS') {
            res.statusCode = 204
            return res.end()
          }

          try {
            const mockData = await readMockData()
            console.log('Mock data loaded:', mockData)

            // GET /api/todos - 获取所有任务
            if (req.method === 'GET' && parsedUrl.pathname === '/api/todos') {
              console.log('Handling GET request')
              return res.end(JSON.stringify(mockData))
            }

            // POST /api/todos - 创建新任务
            if (req.method === 'POST' && parsedUrl.pathname === '/api/todos') {
              const newTask = await parseBody(req)
              mockData.tasks.unshift(newTask)
              await writeMockData(mockData)
              return res.end(JSON.stringify(newTask))
            }

            // PATCH /api/todos/:id - 更新任务状态
            const patchMatch = parsedUrl.pathname.match(/^\/api\/todos\/([\w-]+)$/)
            if (req.method === 'PATCH' && patchMatch) {
              const id = patchMatch[1]
              const updates = await parseBody(req)
              const taskIndex = mockData.tasks.findIndex((task) => task.id === id)

              if (taskIndex !== -1) {
                mockData.tasks[taskIndex] = { ...mockData.tasks[taskIndex], ...updates }
                await writeMockData(mockData)
                return res.end(JSON.stringify(mockData.tasks[taskIndex]))
              } else {
                res.statusCode = 404
                return res.end(JSON.stringify({ error: 'Task not found' }))
              }
            }

            // DELETE /api/todos/:id - 删除任务
            const deleteMatch = parsedUrl.pathname.match(/^\/api\/todos\/([\w-]+)$/)
            if (req.method === 'DELETE' && deleteMatch) {
              const id = deleteMatch[1]
              mockData.tasks = mockData.tasks.filter((task) => task.id !== id)
              await writeMockData(mockData)
              return res.end(JSON.stringify({ success: true }))
            }

            // 处理未知请求
            res.statusCode = 404
            return res.end(JSON.stringify({ error: 'Not found' }))
          } catch (error) {
            console.error('Error in middleware:', error)
            res.statusCode = 500
            return res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        })
      }
    },
  }
}
