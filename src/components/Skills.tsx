import type { Component } from 'solid-js';
import { usePortfolioData } from '../hooks/usePortfolioData';

const Skills: Component = () => {
  const data = usePortfolioData;

  return (
    <section id="skills" class="py-24 bg-gray-900 text-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center animate-fade-in-down">Навыки</h2>
        <ul class="flex flex-wrap justify-center gap-4 md:gap-6 animate-fade-in-up">
          {data()?.()?.skills.map(skill => (
            <li class="bg-gray-800 rounded-lg px-5 py-2 text-lg font-medium shadow hover:bg-sky-900 transition">
              {skill.label}
            </li>
          )) || (
            <div class="col-span-full text-center py-8">
              <p class="text-gray-400">Навыки будут отображены после добавления данных</p>
            </div>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Skills;
