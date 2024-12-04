<script setup>
import TodoList from "./components/TodoList.vue";
import TodoModal from "./components/TodoModal.vue";
import { useTodoStore } from "./stores/todo";
import { ref, onMounted } from "vue";

const store = useTodoStore();
const isMenuOpen = ref(false);
const activeStatus = ref("todo");
const isModalOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function switchStatus(status) {
  activeStatus.value = status;
  if (window.innerWidth < 768) {
    isMenuOpen.value = false;
  }
}

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

onMounted(async () => {
  store.initializeFromStorage();
  await store.fetchTodos();
});
</script>

<template>
  <header>
    <nav class="navbar navbar-dark bg-dark text-white">
      <div class="container">
        <!-- 移动端菜单按钮 -->
        <div class="d-flex d-md-none justify-content-between align-items-center w-100">
          <button
            class="btn btn-link text-white text-decoration-none p-0"
            @click="openModal"
          >
            Create Todo
          </button>
          <button
            class="navbar-toggler border-0"
            type="button"
            @click="toggleMenu"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <!-- 导航菜单 -->
        <div
          :class="['navbar-content w-100', isMenuOpen ? 'd-block' : 'd-none d-md-flex']"
        >
          <div
            class="d-flex flex-column flex-md-row align-items-start align-items-md-center"
          >
            <button
              class="btn btn-link text-white text-decoration-none p-0 brand d-none d-md-block me-4"
              @click="openModal"
            >
              Create Todo
            </button>
            <span
              class="nav-item"
              :class="{ active: activeStatus === 'todo' }"
              @click="switchStatus('todo')"
              role="button"
              tabindex="0"
              aria-label="Show todo tasks"
            >
              Todo
              <span class="badge bg-danger ms-1">{{ store.todoCount }}</span>
            </span>
            <span
              class="nav-item"
              :class="{ active: activeStatus === 'inProgress' }"
              @click="switchStatus('inProgress')"
              role="button"
              tabindex="0"
              aria-label="Show in progress tasks"
            >
              In Progress
              <span class="badge bg-primary ms-1 border-0">{{
                store.inProgressCount
              }}</span>
            </span>
            <span
              class="nav-item"
              :class="{ active: activeStatus === 'completed' }"
              @click="switchStatus('completed')"
              role="button"
              tabindex="0"
              aria-label="Show completed tasks"
            >
              Completed
              <span class="badge bg-success ms-1">{{ store.completedCount }}</span>
            </span>
          </div>
          <div
            class="d-flex flex-column flex-md-row align-items-start align-items-md-center"
          >
            <span class="me-md-3 mb-2 mb-md-0">Tony Stark</span>
            <button
              class="btn btn-link text-white text-decoration-none p-0"
              aria-label="Log out"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <main class="container py-4">
    <!-- 加载状态 -->
    <div v-if="store.isLoading" class="text-center py-4" role="status">
      <div class="spinner-border text-primary" aria-hidden="true"></div>
      <span class="visually-hidden">Loading...</span>
    </div>

    <!-- 错误提示 -->
    <div v-if="store.error" class="alert alert-danger" role="alert" aria-live="polite">
      {{ store.error }}
    </div>

    <!-- 主内容 -->
    <TodoList v-if="!store.isLoading" :active-status="activeStatus" />
  </main>

  <!-- 创建任务弹窗 -->
  <TodoModal v-if="isModalOpen" @close="closeModal" />
</template>

<style scoped>
.navbar {
  padding: 1rem 0;
  border: none !important;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-item {
  margin-right: 2rem;
  cursor: pointer;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;
  border: none !important;
}

.nav-item:hover {
  color: rgba(255, 255, 255, 0.8);
}

.nav-item.active {
  color: #fff;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #fff;
}

.navbar-toggler:focus {
  box-shadow: none;
}

/* 移动端样式优化 */
@media (max-width: 767.98px) {
  .navbar .container {
    flex-direction: column;
  }

  .navbar-content {
    flex-direction: column;
    padding: 1rem 0;
  }

  .nav-item {
    margin-right: 0;
    margin-bottom: 0.75rem;
  }

  /* 增加移动端字体大小和间距 */
  .navbar span {
    font-size: 1.1rem;
    padding: 0.5rem 0;
  }

  /* 增加按钮可点击区域 */
  .navbar .btn-link {
    font-size: 1.1rem;
    padding: 0.5rem 0 !important;
    margin: 0.5rem 0;
    width: 100%;
    text-align: left;
  }

  /* 调整 badge 样式 */
  .badge {
    font-size: 0.9rem;
    padding: 0.4em 0.5em !important;
  }

  /* 增加菜单项之间的间距 */
  .navbar .d-flex > span {
    margin-bottom: 0.75rem !important;
  }

  .nav-item.active::after {
    width: 4px;
    height: 100%;
    left: -1rem;
    bottom: 0;
  }
}

main {
  width: 100%;
  margin: 0 auto;
}

/* 调整主内容区域在移动端的间距 */
@media (max-width: 767.98px) {
  main {
    padding: 1rem 0;
  }
}

@media (min-width: 1024px) {
  main {
    padding: 2rem 0;
  }
}

/* 修改键盘焦点样式 */
.nav-item:focus {
  outline: none; /* 移除默认的白色轮廓 */
}

/* 可以添加其他焦点样式，比如背景色变化 */
.nav-item:focus-visible {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* 移除按钮焦点时的轮廓 */
.btn:focus,
.btn-link:focus,
.navbar-toggler:focus {
  outline: none;
  box-shadow: none;
}

/* 如果需要保持可访问性，可以添加其他视觉反馈 */
.btn:focus-visible,
.btn-link:focus-visible {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* 添加加载动画样式 */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* 移除徽章的边框 */
.badge {
  border: none !important;
}

/* 移除按钮的边框 */
.btn {
  border: none !important;
}

/* 移除导航栏的边框 */
.navbar {
  padding: 1rem 0;
  border: none !important;
}

/* 移除导航栏切换按钮的边框 */
.navbar-toggler {
  border: none !important;
  box-shadow: none !important;
}
</style>
