import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 生成随机日期
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toLocaleString("en-US", { timeZone: "Asia/Singapore" });
}

// 添加任务标签
const taskTags = ["工作", "学习", "生活", "重要", "紧急"];

// 生成随机任务数据
function generateTasks() {
  const tasks = [];

  // 生成40条 todo 状态的任务
  for (let i = 0; i < 40; i++) {
    tasks.push(generateTask("todo", i));
  }

  // 生成5条 inProgress 状态的任务
  for (let i = 0; i < 5; i++) {
    tasks.push(generateTask("inProgress", i));
  }

  // 生成5条 completed 状态的任务
  for (let i = 0; i < 5; i++) {
    tasks.push(generateTask("completed", i));
  }

  return tasks;
}

// 生成随机任务数据
function generateTask(status, index) {
  return {
    id: uuidv4(),
    title: `Todo Task ${index + 1}`,
    description: `This is a detailed description for todo task ${
      index + 1
    }. It includes all the necessary information and requirements that need to be completed.`,
    status: status,
    createdAt: randomDate(new Date(2024, 0, 1), new Date()),
    image: `https://picsum.photos/320/200?random=${index}`,
    tags: Array(Math.floor(Math.random() * 3) + 1)
      .fill()
      .map(() => taskTags[Math.floor(Math.random() * taskTags.length)]),
  };
}

// 创建 mock 数据文件
const mockData = {
  tasks: generateTasks(),
};

// 确保 public/mock 目录存在
const mockDir = path.resolve(__dirname, "../public/mock");
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

// 写入 mock 数据
fs.writeFileSync(path.resolve(mockDir, "todos.json"), JSON.stringify(mockData, null, 2));

console.log("Mock data generated successfully!");
