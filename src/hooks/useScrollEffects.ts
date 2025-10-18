import { onMount } from 'solid-js';

/**
 * Кастомный хук для управления эффектами скролла страницы
 * Выделяет логику скролла из компонента Header
 */
export const useScrollEffects = () => {
  onMount(() => {
    const header = document.getElementById('header');
    const scrollToTopButton = document.getElementById('scroll-to-top');
    const sections = ['skills', 'about', 'projects', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;

      // Стилизация шапки при прокрутке
      if (isScrolled) {
        header?.classList.add('bg-gray-900/80', 'backdrop-blur-sm', 'shadow-lg');
      } else {
        header?.classList.remove('bg-gray-900/80', 'backdrop-blur-sm', 'shadow-lg');
      }

      // Показать/скрыть кнопку "Наверх"
      if (window.scrollY > 300) {
        scrollToTopButton?.classList.remove('hidden');
      } else {
        scrollToTopButton?.classList.add('hidden');
      }

      // Подсветка активной ссылки в навигации
      let currentSection = '';
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach(sectionId => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement && scrollPosition >= sectionElement.offsetTop && scrollPosition < sectionElement.offsetTop + sectionElement.offsetHeight) {
          currentSection = sectionId;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('nav-link-active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('nav-link-active');
        }
      });
    };

    // Кнопка "Наверх"
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызов для начальной установки

    scrollToTopButton?.addEventListener('click', handleScrollToTop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      scrollToTopButton?.removeEventListener('click', handleScrollToTop);
    };
  });
};