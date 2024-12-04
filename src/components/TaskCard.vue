<script setup>
import { ref } from 'vue';

defineProps({
  task: {
    type: Object,
    required: true,
  },
  onStart: {
    type: Function,
    default: null,
  },
  onComplete: {
    type: Function,
    default: null,
  },
  onRemove: {
    type: Function,
    required: true,
  },
});

const imageLoaded = ref(false);
const imageError = ref(false);

function handleImageLoad() {
  imageLoaded.value = true;
}

function handleImageError() {
  imageError.value = true;
}
</script>

<template>
  <div class="card border-0 task-card h-100">
    <div class="bg-light task-image">
      <!-- 加载占位符 -->
      <div v-if="!imageLoaded && !imageError" class="image-placeholder d-flex align-items-center justify-content-center">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- 图片加载失败显示占位符 -->
      <div v-if="imageError" class="image-placeholder d-flex align-items-center justify-content-center">
        <span class="text-muted">Image not available</span>
      </div>

      <!-- 实际图片 -->
      <img
        :src="task.image"
        :alt="task.title"
        class="task-image-content"
        :class="{ 'image-loaded': imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
        loading="lazy"
      >
    </div>
    <div class="card-body px-4 d-flex flex-column">
      <h6 class="card-title">{{ task.title }}</h6>
      <p class="card-text small text-muted description">{{ task.description }}</p>
      <div class="mt-auto">
        <p class="card-text">
          <small class="text-muted">Created At: {{ task.createdAt }}</small>
        </p>
        <div class="d-flex gap-2">
          <button v-if="onStart" @click="onStart(task.id)" class="btn btn-primary btn-sm">
            Start
          </button>
          <button
            v-if="onComplete"
            @click="onComplete(task.id)"
            class="btn btn-success btn-sm"
          >
            Complete
          </button>
          <button @click="onRemove(task.id)" class="btn btn-link btn-sm text-danger">
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.task-image {
  position: relative;
  height: 200px;
  min-height: 200px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  transition: opacity 0.3s ease;
}

.task-image-content {
  position: absolute;
  top: 0;
  left: 0;
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

.image-placeholder {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #f8f8f8 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.card-title {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  line-height: 1.4;
  height: 2.8em; /* 固定标题高度为2行 */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.description {
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制为3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  height: 4.5em; /* 3行的高度 */
}

.btn-link {
  text-decoration: none;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

/* 移动端样式优化 */
@media (max-width: 767.98px) {
  .card-body {
    padding: 1.25rem 1rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .card-text {
    font-size: 1rem;
  }

  /* 增加按钮大小和间距 */
  .btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .btn-link {
    padding: 0.5rem 0;
  }

  /* 调整按钮组间距 */
  .d-flex.gap-2 {
    gap: 1rem !important;
  }
}
</style>
