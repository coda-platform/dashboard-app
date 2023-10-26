// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [];

const publicRouter = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkExactActiveClass: "active",
  routes,
});

export default publicRouter;
