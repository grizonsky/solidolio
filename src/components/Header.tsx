import { useScrollEffects } from '../hooks/useScrollEffects';
import { useMobileMenu } from '../hooks/useMobileMenu';

export default function Header() {
  // Используем кастомные хуки для разделения ответственности
  useScrollEffects();
  useMobileMenu();

  return (
    <header id="header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <a href="#" class="text-2xl font-bold text-sky-400">CreativeSolidolio</a>
          <div class="hidden md:flex items-center space-x-4">
            <a href="#skills" class="nav-link px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">Навыки</a>
            <a href="#about" class="nav-link px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">Обо мне</a>
            <a href="#projects" class="nav-link px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">Проекты</a>
            <a href="#contact" class="nav-link px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">Контакты</a>
          </div>
          <div class="md:hidden">
            <button id="mobile-menu-button" class="text-white focus:outline-none" aria-label="Открыть меню">
              <i data-lucide="menu" id="menu-icon"></i>
              <i data-lucide="x" id="close-icon" class="hidden"></i>
            </button>
          </div>
        </div>
      </nav>
      <div id="mobile-menu" class="hidden md:hidden bg-gray-900/90 backdrop-blur-sm">
        <div class="flex flex-col items-center px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#skills" class="nav-link block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white">Навыки</a>
          <a href="#about" class="nav-link block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white">Обо мне</a>
          <a href="#projects" class="nav-link block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white">Проекты</a>
          <a href="#contact" class="nav-link block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white">Контакты</a>
        </div>
      </div>
    </header>
  );
}
