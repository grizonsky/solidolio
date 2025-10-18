import type { Component } from 'solid-js';
import { onMount } from 'solid-js';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useLucide } from '../hooks/useLucide';

const Projects: Component = () => {
  const data = usePortfolioData();

  return (
    <section id="projects" class="py-20">
      <h2 class="text-4xl font-bold text-center mb-12 flex items-center justify-center">
        <i data-lucide="briefcase" class="mr-4 text-sky-400"></i> Избранные Проекты
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.()?.projects.map((project) => (
          <div class="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-sky-500/30 transition-all duration-300 flex flex-col transform hover:-translate-y-2">
            <div class="overflow-hidden">
              <img
                src={project.backgroundImage || project.image || `https://placehold.co/600x400/10B981/FFFFFF?text=${encodeURIComponent(project.title)}`}
                alt={project.title}
                class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="p-6 flex-grow flex flex-col">
              <h3 class="text-2xl font-bold mb-2 text-sky-400">{project.title}</h3>
              <p class="text-gray-300 mb-4 flex-grow">{project.description}</p>
              <div class="mt-auto flex justify-end space-x-4">
                <a href={project.link} target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-sky-400 transition-colors duration-300 flex items-center">
                  <i data-lucide="external-link" class="w-5 h-5 mr-2"></i> Live Demo
                </a>
              </div>
            </div>
          </div>
        )) || (
          <div class="col-span-full text-center py-12">
            <p class="text-gray-400 text-lg">Проекты будут добавлены скоро...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
