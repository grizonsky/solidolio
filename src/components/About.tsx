import type { Component } from 'solid-js';
import { onMount, createSignal } from 'solid-js';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useLucide } from '../hooks/useLucide';

const About: Component = () => {
  const data = usePortfolioData();
  const [currentPhotoIndex, setCurrentPhotoIndex] = createSignal(0);

  // Функція для вибору випадкового фото при кожному завантаженні
  const getRandomPhoto = () => {
    const photos = data?.().photos || [];
    if (photos.length === 0) return null;

    // Використовуємо localStorage для запам'ятовування останнього фото
    const lastIndex = localStorage.getItem('lastPhotoIndex');
    let newIndex;

    if (lastIndex !== null) {
      // Знаходимо наступне фото (циклічно)
      newIndex = (parseInt(lastIndex) + 1) % photos.length;
    } else {
      // Для першого разу вибираємо випадкове фото
      newIndex = Math.floor(Math.random() * photos.length);
    }

    localStorage.setItem('lastPhotoIndex', newIndex.toString());
    return photos[newIndex];
  };

  onMount(() => {
    // Встановлюємо випадкове фото при завантаженні
    const randomPhoto = getRandomPhoto();
    if (randomPhoto) {
      setCurrentPhotoIndex(data?.().photos.findIndex(p => p.url === randomPhoto.url) || 0);
    }
  });

  const currentPhoto = () => {
    const photos = data?.().photos || [];
    if (photos.length === 0) return null;
    return photos[currentPhotoIndex()];
  };

  return (
    <section id="about" class="py-20">
      <h2 class="text-4xl font-bold text-center mb-12 flex items-center justify-center">
        <i data-lucide="user" class="mr-4 text-sky-400"></i> Обо мне
      </h2>
      <div class="flex flex-col md:flex-row items-center gap-12">
        <div class="md:w-1/3">
          <div class="w-64 h-64 rounded-full mx-auto bg-gradient-to-br from-sky-500 to-violet-600 p-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <img
              src={currentPhoto()?.url || "https://placehold.co/400x400/1E293B/94A3B8?text=No+Photo"}
              alt={currentPhoto()?.alt || "Фото профілю"}
              class="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1E293B/94A3B8?text=No+Photo';
              }}
            />
          </div>
        </div>
        <div class="md:w-2/3 text-lg text-gray-300 space-y-4 text-center md:text-left">
          <p class="whitespace-pre-line">{data?.().about.text || 'Профессиональный веб-разработчик с опытом создания современных веб-приложений и пользовательских интерфейсов.'}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
