import { usePortfolioData } from '../hooks/usePortfolioData';
import { useLucide } from '../hooks/useLucide';

export default function HeroSection() {
  const data = usePortfolioData();

  useLucide();

  return (
    <section id="skills" class="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 class="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-down">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">
          {data?.()?.hero.name || 'Веб-разработчик'}
        </span>
      </h1>
      <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl animate-fade-in-up">
        {data?.()?.hero.description || 'Создаю современные веб-приложения с использованием передовых технологий.'}
      </p>
      <a href="#projects" class="mb-12 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold py-3 px-8 rounded-full hover:from-sky-600 hover:to-violet-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
        Посмотреть работы
      </a>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-4xl">
        {data?.()?.skills.map((skill) => (
          <div class="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-violet-500/20 hover:-translate-y-2 transition-all duration-300 transform-gpu">
            <p class="font-semibold">{skill.label}</p>
          </div>
        )) || (
          <div class="col-span-full text-center py-8">
            <p class="text-gray-400">Навыки будут отображены после добавления данных</p>
          </div>
        )}
      </div>
    </section>
  );
}
