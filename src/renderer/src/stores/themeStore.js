import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

const THEME_KEY = "app-theme";

export const [themeState, setThemeState] = createStore({
  isDark: false,
  isTransitioning: false
});

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const applyTheme = (isDark) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
};

export const toggleTheme = () => {
  setThemeState("isTransitioning", true);
  setThemeState("isDark", !themeState.isDark);
  applyTheme(themeState.isDark);
  
  setTimeout(() => {
    setThemeState("isTransitioning", false);
  }, 500);
};

export const initializeTheme = () => {
  const isDark = getInitialTheme();
  setThemeState("isDark", isDark);
  applyTheme(isDark);
};