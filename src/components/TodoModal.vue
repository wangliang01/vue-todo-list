<script setup>
import { ref } from 'vue';
import { useTodoStore } from '../stores/todo';

const store = useTodoStore();
const title = ref('');
const description = ref('');

const emit = defineEmits(['close']);

async function handleSubmit() {
  if (!title.value.trim()) return;

  await store.addTodo({
    title: title.value,
    description: description.value,
    image: 'https://picsum.photos/320/200?random=' + Date.now(),
  });

  title.value = '';
  description.value = '';
  emit('close');
}
</script>

<template>
  <div class="modal-wrapper">
    <div class="modal fade show" style="display: block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Task</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="emit('close')"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="taskTitle" class="form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="taskTitle"
                  v-model="title"
                  required
                  aria-required="true"
                >
              </div>
              <div class="mb-3">
                <label for="taskDescription" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="taskDescription"
                  v-model="description"
                  rows="3"
                ></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="emit('close')">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal {
  position: relative;
  width: 100%;
  pointer-events: none;
}

.modal-dialog {
  pointer-events: auto;
}

/* 移除 Bootstrap 默认的背景蒙层 */
:deep(.modal-backdrop) {
  display: none;
}
</style>
