<script setup>
import { ref } from "vue";
import { useTodoStore } from "../stores/todo";

const store = useTodoStore();
const title = ref("");
const description = ref("");

const emit = defineEmits(["added"]);

async function handleSubmit() {
  if (!title.value.trim()) return;

  await store.addTodo({
    title: title.value,
    description: description.value,
    image: "https://picsum.photos/320/200?random=" + Date.now(),
  });

  title.value = "";
  description.value = "";
  emit("added");
}
</script>

<template>
  <div class="card border-0 mb-4">
    <div class="card-body">
      <h5 class="card-title">Add New Task</h5>
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
          />
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
        <button type="submit" class="btn btn-primary">Add Task</button>
      </form>
    </div>
  </div>
</template>
