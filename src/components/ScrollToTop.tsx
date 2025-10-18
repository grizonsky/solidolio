
import { useLucide } from '../hooks/useLucide';

export default function ScrollToTop() {
  useLucide();

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="scroll-to-top"
      class="hidden fixed bottom-8 right-8 bg-sky-500 text-white p-3 rounded-full shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-all duration-300 transform hover:scale-110"
      onClick={scrollUp}
      aria-label="Наверх"
    >
      <i data-lucide="chevron-up"></i>
    </button>
  );
}
