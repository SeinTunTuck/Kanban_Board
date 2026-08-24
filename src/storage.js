import { DEFAULT_CATEGORIES, createStarterTasks } from "./data";

const TASKS_KEY = "taskflow.tasks.v1";
const CATEGORIES_KEY = "taskflow.categories.v1";

function readJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function loadTasks() {
  return readJSON(TASKS_KEY, createStarterTasks());
}

export function loadCategories() {
  return readJSON(CATEGORIES_KEY, DEFAULT_CATEGORIES);
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
