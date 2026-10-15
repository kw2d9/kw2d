import { site } from "@/lib/config";

export type Theme = "light" | "dark";
export const THEME_KEY = "kw2d_theme";

/** Inlined in <head> so the theme is set before first paint (no flash). Uses the saved pick only while the toggle is on. */
export const themeScript = `try{var t=${site.themeToggle}?localStorage.getItem("${THEME_KEY}"):null;document.documentElement.dataset.theme=t==="dark"||t==="light"?t:"${site.defaultTheme}"}catch(e){document.documentElement.dataset.theme="${site.defaultTheme}"}`;
