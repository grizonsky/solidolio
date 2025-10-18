import type { Component } from 'solid-js';
import { onMount } from 'solid-js';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useLucide } from '../hooks/useLucide';

const Contact: Component = () => {
  const data = usePortfolioData();

  return (
    <section id="contact" class="py-20">
      <h2 class="text-4xl font-bold text-center mb-12 flex items-center justify-center">
        <i data-lucide="mail" class="mr-4 text-sky-400"></i> Контакты
      </h2>
      <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12">
          {/* Контактная информация */}
          <div class="space-y-8">
            <div>
              <h3 class="text-2xl font-semibold mb-6 text-sky-400">Свяжитесь со мной</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <i data-lucide="mail" class="w-6 h-6 text-sky-400"></i>
                  <a href={`mailto:${data?.()?.contact.email}`} class="text-gray-300 hover:text-sky-400 transition-colors duration-300">
                    {data?.()?.contact.email}
                  </a>
                </div>
                <div class="flex items-center space-x-4">
                  <i data-lucide="map-pin" class="w-6 h-6 text-sky-400"></i>
                  <span class="text-gray-300">Готов к релокации</span>
                </div>
              </div>
            </div>

            {/* Социальные сети */}
            <div>
              <h4 class="text-xl font-semibold mb-4 text-sky-400">Социальные сети</h4>
              <div class="flex space-x-6">
                {data?.()?.contact.socials.map(social => (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-300 hover:text-sky-400 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span>{social.label}</span>
                  </a>
                )) || (
                  <div class="col-span-full text-center py-4">
                    <p class="text-gray-400 text-sm">Ссылки на социальные сети будут добавлены</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Форма контакта */}
          <div class="bg-gray-800 rounded-lg p-8">
            <form class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label for="message" class="block text-sm font-medium text-gray-300 mb-2">Сообщение</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Ваше сообщение..."
                ></textarea>
              </div>
              <button
                type="submit"
                class="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <i data-lucide="send" class="w-5 h-5 mr-2"></i>
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
