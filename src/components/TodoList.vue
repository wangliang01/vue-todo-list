<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useTodoStore } from "../stores/todo";
import TaskCard from "./TaskCard.vue";

const props = defineProps({
  activeStatus: {
    type: String,
    required: true,
  },
});

const store = useTodoStore();

// 获取当前状态对应的任务列表
const currentTasks = computed(() => {
  switch (props.activeStatus) {
    case "todo":
      return store.todos;
    case "inProgress":
      return store.inProgress;
    case "completed":
      return store.completed;
    default:
      return [];
  }
});

// 分页相关状态
const pageSize = 12; // 每页显示的任务数
const currentPage = ref(1);
const isLoading = ref(false);
const observerTarget = ref(null);

// 计算分页后的任务列表，确保按创建时间倒序排序
const paginatedTasks = computed(() => {
  const sortedTasks = [...currentTasks.value].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  const start = 0;
  const end = currentPage.value * pageSize;
  return sortedTasks.slice(start, end);
});

// 是否还有更多数据
const hasMore = computed(() => {
  return paginatedTasks.value.length < currentTasks.value.length;
});

// 获取当前状态对应的操作按钮
const getTaskActions = (task) => {
  switch (props.activeStatus) {
    case "todo":
      return {
        onStart: store.startTodo,
        onRemove: store.removeTodo,
      };
    case "inProgress":
      return {
        onComplete: store.completeTodo,
        onRemove: store.removeTodo,
      };
    case "completed":
      return {
        onRemove: store.removeTodo,
      };
    default:
      return {};
  }
};

// 处理加载更多
function loadMore() {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  setTimeout(() => {
    currentPage.value++;
    isLoading.value = false;
  }, 300);
}

// 设置 Intersection Observer
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore.value) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// 当状态改变时重置分页
watch(
  () => props.activeStatus,
  () => {
    currentPage.value = 1;
  }
);

// 新闻图片加载状态
const newsImages = ref([
  {
    url: "https://picsum.photos/800/600?random=news1",
    loaded: false,
    error: false,
  },
  {
    url: "https://picsum.photos/800/600?random=news2",
    loaded: false,
    error: false,
  },
]);

function handleNewsImageLoad(index) {
  newsImages.value[index].loaded = true;
}

function handleNewsImageError(index) {
  newsImages.value[index].error = true;
}
</script>

<template>
  <div class="container-fluid">
    <!-- 任务列表 -->
    <div class="row g-4 mb-5">
      <div class="col-12 col-sm-6 col-lg-4" v-for="task in paginatedTasks" :key="task.id">
        <TaskCard :task="task" v-bind="getTaskActions(task)" />
      </div>
    </div>

    <!-- 加载更多指示器 -->
    <div v-if="hasMore" ref="observerTarget" class="text-center py-4">
      <div v-if="isLoading" class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading more tasks...</span>
      </div>
    </div>

    <!-- Company News -->
    <h5 class="mb-3">Company News</h5>
    <div class="row g-4">
      <div v-for="(news, index) in newsImages" :key="index" class="col-md-12">
        <div class="card border-0">
          <div class="row g-0 news-item">
            <div class="col-md-6 news-image-wrapper">
              <!-- 加载占位符 -->
              <div
                v-if="!news.loaded && !news.error"
                class="news-placeholder d-flex align-items-center justify-content-center"
              >
                <div class="spinner-border text-secondary" role="status">
                  <span class="visually-hidden">Loading news image...</span>
                </div>
              </div>

              <!-- 图片加载失败显示占位符 -->
              <div
                v-if="news.error"
                class="news-placeholder d-flex align-items-center justify-content-center"
              >
                <span class="text-muted">News image not available</span>
              </div>

              <!-- 实际图片 -->
              <img
                :src="news.url"
                :alt="`News title ${index + 1}`"
                class="news-image"
                :class="{ 'image-loaded': news.loaded }"
                @load="handleNewsImageLoad(index)"
                @error="handleNewsImageError(index)"
                loading="lazy"
              />
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <h6 class="card-title">News title {{ index + 1 }}</h6>
                <p class="card-text small text-muted">
                  Some default text to fill some space, and something more so there is
                  more text Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                  Officia esse consequatur numquam. Voluptates nihil facere laborum
                  eligendi neque possimus ipsum numquam?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 现有样式保持不变 */
.news-item {
  display: flex;
  flex-wrap: wrap;
}

.news-image-wrapper {
  position: relative;
  overflow: hidden;
}

.news-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  transition: opacity 0.3s ease;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-loaded {
  opacity: 1;
}

/* 添加图片加载动画 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.news-placeholder {
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* 移动端样式优化 */
@media (max-width: 767.98px) {
  .news-item {
    display: block;
  }

  .news-image-wrapper {
    width: 100%;
  }

  .news-placeholder {
    height: 200px;
    margin-bottom: 1rem;
  }

  .card-body {
    padding: 1rem 0;
  }

  .news-image {
    height: 200px;
  }
}

/* 桌面端样式 */
@media (min-width: 768px) {
  .news-image {
    height: 320px;
  }

  /* 第二个新闻的布局调整 */
  .col-md-12:nth-child(2) .news-item {
    flex-direction: row-reverse;
  }
}
</style>
