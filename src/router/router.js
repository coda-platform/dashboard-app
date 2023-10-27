// Composables
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home";
import StatsLauncher from "@/views/StatsLauncher";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import HomeMetrics from "@/views/HomeMetrics";
import LearningLauncher from "@/views/LearningLauncher";
import Connections from "@/views/Connections";
import UI from "@/views/UI";
import Forest from "@/components/Forest";

const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      header: AppHeader,
      default: Home,
      footer: Footer,
    },
    meta: {
      title: "CODA platform",
    },
  },
  {
    path: "/stats",
    name: "Stats",
    components: {
      header: AppHeader,
      default: StatsLauncher,
      footer: Footer,
    },
    meta: {
      title: "CODA - Stats",
    },
  },
  {
    path: "/homemetrics",
    name: "HomeMetrics",
    components: {
      header: AppHeader,
      default: HomeMetrics,
      footer: Footer,
    },
    meta: {
      title: "CODA - HomeMetrics",
    },
  },
  {
    path: "/learning",
    name: "Learning",
    components: {
      header: AppHeader,
      default: LearningLauncher,
      footer: Footer,
    },
    meta: {
      title: "CODA - Learning",
    },
  },
  {
    path: "/ui",
    name: "UI",
    components: {
      header: AppHeader,
      default: UI,
      footer: Footer,
    },
    meta: {
      title: "CODA - UI Dashboard - (Connected data selection)",
    },
  },
  {
    path: "/forest",
    name: "Forest",
    components: {
      header: AppHeader,
      default: Forest,
      footer: Footer,
    },
    meta: {
      title: "CODA - Forest",
    },
  },
  {
    path: "/connections",
    name: "Connections",
    components: {
      header: AppHeader,
      default: Connections,
      footer: Footer,
    },
    meta: {
      title: "CODA - Connections",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkExactActiveClass: "active",
  routes,
});

export default router;
