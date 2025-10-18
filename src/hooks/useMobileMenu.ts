import { onMount } from 'solid-js';

/**
 * Кастомный хук для управления мобильным меню
 * Выделяет логику мобильного меню из компонента Header
 */
export const useMobileMenu = () => {
  onMount(() => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    // Обработчик клика по кнопке мобильного меню
    const handleMobileMenuToggle = () => {
      mobileMenu?.classList.toggle('hidden');
      menuIcon?.classList.toggle('hidden');
      closeIcon?.classList.toggle('hidden');
    };

    // Обработчик закрытия меню при клике на ссылку
    const handleMobileMenuClose = () => {
      mobileMenu?.classList.add('hidden');
      menuIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
    };

    mobileMenuButton?.addEventListener('click', handleMobileMenuToggle);

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', handleMobileMenuClose);
    });

    return () => {
      mobileMenuButton?.removeEventListener('click', handleMobileMenuToggle);
      document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.removeEventListener('click', handleMobileMenuClose);
      });
    };
  });
};