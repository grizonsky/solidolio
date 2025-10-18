import { onMount } from 'solid-js';

// Додаємо декларацію для window.lucide
declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

/**
 * Кастомный хук для инициализации иконок Lucide
 * Централизует повторяющуюся логику инициализации иконок
 */
export const useLucide = () => {
  onMount(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
};