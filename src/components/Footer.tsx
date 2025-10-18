
import { useLucide } from '../hooks/useLucide';

export default function Footer() {
  useLucide();
  return (
    <footer class="bg-gray-900/50 border-t border-gray-800">
      <div class="container mx-auto px-6 py-8 text-center text-gray-400">
        <div class="flex justify-center space-x-6 mb-4">
          <a href="#" class="hover:text-sky-400 transition-colors duration-300"><i data-lucide="github"></i></a>
          <a href="#" class="hover:text-sky-400 transition-colors duration-300"><i data-lucide="linkedin"></i></a>
          <a href="#" class="hover:text-sky-400 transition-colors duration-300"><i data-lucide="twitter"></i></a>
        </div>
        <p>&copy; 2024 CreativeSolidolio. Все права защищены.</p>
      </div>
    </footer>
  );
}
