import { createSignal, createResource, createEffect, onMount, Show, For } from 'solid-js';
import { defaultPortfolioData, savePortfolioData } from '../data/portfolioData';
import { setPortfolioContent } from '../data/fireproofPortfolio';
import type { PortfolioData } from '../data/portfolioData';
import { fileToBase64, validateImageSize } from '../utils/imageUtils';

// Типы для аутентификации
interface AuthState {
  isAuthenticated: boolean;
  password: string;
  error: string;
}

// Создаем store для данных портфолио
const createPortfolioStore = () => {
  const [data, setData] = createSignal<PortfolioData>(defaultPortfolioData);
  const [saveStatus, setSaveStatus] = createSignal<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errors, setErrors] = createSignal<Record<string, string>>({});

  // Загружаем данные из localStorage
  const loadData = async (): Promise<PortfolioData> => {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        return defaultPortfolioData;
      }
    }
    return defaultPortfolioData;
  };

  // Асинхронная загрузка данных
  const [portfolioData] = createResource(loadData);

  // Обновляем состояние при загрузке данных
  createEffect(() => {
    const loadedData = portfolioData();
    if (loadedData) {
      setData(loadedData);
    }
  });

  // Валидация данных
  const validateData = (data: PortfolioData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.about?.text?.trim()) {
      errors.about = 'Текст про себе не може бути порожнім';
    }

    if ((data.skills?.length || 0) === 0) {
      errors.skills = 'Додайте хоча б одну навичку';
    }

    data.skills?.forEach((skill: { label: string }, index: number) => {
      if (!skill.label.trim()) {
        errors[`skill_${index}`] = 'Назва навички не може бути порожньою';
      }
    });

    if ((data.projects?.length || 0) === 0) {
      errors.projects = 'Додайте хоча б один проєкт';
    }

    data.projects?.forEach((project: { title: string; description: string; link: string; image?: string }, index: number) => {
      if (!project.title.trim()) {
        errors[`project_title_${index}`] = 'Назва проєкту не може бути порожньою';
      }
      if (!project.description.trim()) {
        errors[`project_description_${index}`] = 'Опис проєкту не може бути порожнім';
      }
    });

    data.contact?.socials?.forEach((_social: { label: string; url: string }, _index: number) => {
      // Можна додати додаткову валідацію для соцмереж
    });

    if (!data.contact?.email?.trim()) {
      errors.email = 'Email не може бути порожнім';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact?.email || '')) {
      errors.email = 'Невірний формат email';
    }

    return errors;
  };

  // Сохранение данных
  const saveData = async () => {
    const currentData = data();
    const validationErrors = validateData(currentData || defaultPortfolioData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    setErrors({});

    try {
      await setPortfolioContent(currentData);

      // Оновлюємо localStorage для синхронізації між вкладками
      savePortfolioData(currentData);

      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (e) {
      setSaveStatus('error');
    }
  };

  // Методы для обновления данных
  const updateHero = (field: keyof PortfolioData['hero'], value: string) => {
    setData(prev => ({
      ...prev,
      hero: {
        ...prev?.hero,
        [field]: value
      }
    }));
  };
  const updateAbout = (text: string) => {
    setData(prev => ({ ...prev, about: { ...prev?.about, text } }));
    if (errors().about) {
      setErrors(prev => ({ ...prev, about: '' }));
    }
  };

  const updateSkill = (index: number, label: string) => {
    setData(prev => ({
      ...prev,
      skills: (prev?.skills || []).map((skill: { label: string }, i: number) =>
        i === index ? { label } : skill
      )
    }));
    if (errors()[`skill_${index}`]) {
      setErrors(prev => ({ ...prev, [`skill_${index}`]: '' }));
    }
  };

  const addSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...(prev?.skills || []), { label: '' }]
    }));
  };

  const removeSkill = (index: number) => {
    setData(prev => ({
      ...prev,
      skills: (prev?.skills || []).filter((_: { label: string }, i: number) => i !== index)
    }));
  };

  const updateProject = (index: number, field: keyof PortfolioData['projects'][0], value: string) => {
    setData(prev => ({
      ...prev,
      projects: (prev?.projects || []).map((project: { title: string; description: string; link: string; image?: string; backgroundImage?: string }, i: number) =>
        i === index ? { ...project, [field]: value } : project
      )
    }));

    // Очищаем ошибки валидации для этого поля
    const errorKey = `project_${field}_${index}`;
    if (errors()[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const updateProjectBackgroundImage = async (index: number, file: File) => {
    try {
      // Валидация размера файла
      const base64String = await fileToBase64(file);
      const validation = validateImageSize(base64String);

      if (!validation.valid) {
        setErrors(prev => ({ ...prev, [`project_bg_${index}`]: validation.error || 'Ошибка размера файла' }));
        return;
      }

      // Обновляем данные проекта с фоновым изображением
      setData(prev => ({
        ...prev,
        projects: (prev?.projects || []).map((project: { title: string; description: string; link: string; image?: string; backgroundImage?: string }, i: number) =>
          i === index ? { ...project, backgroundImage: base64String } : project
        )
      }));

      // Очищаем ошибки для этого поля
      if (errors()[`project_bg_${index}`]) {
        setErrors(prev => ({ ...prev, [`project_bg_${index}`]: '' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [`project_bg_${index}`]: 'Ошибка загрузки изображения' }));
    }
  };

  const removeProjectBackgroundImage = (index: number) => {
    setData(prev => ({
      ...prev,
      projects: (prev?.projects || []).map((project: { title: string; description: string; link: string; image?: string; backgroundImage?: string }, i: number) =>
        i === index ? { ...project, backgroundImage: undefined } : project
      )
    }));
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [...(prev?.projects || []), { title: '', description: '', link: '' }]
    }));
  };

  const removeProject = (index: number) => {
    setData(prev => ({
      ...prev,
      projects: (prev?.projects || []).filter((_: { title: string; description: string; link: string; image?: string }, i: number) => i !== index)
    }));
  };

  const updateContactEmail = (email: string) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev?.contact, email }
    }));
    if (errors().email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const updateSocial = (index: number, field: 'label' | 'url', value: string) => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev?.contact,
        socials: prev?.contact?.socials?.map((social: { label: string; url: string }, i: number) =>
          i === index ? { ...social, [field]: value } : social
        ) || []
      }
    }));
  };

  const addSocial = () => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev?.contact,
        socials: [...(prev?.contact?.socials || []), { label: '', url: '' }]
      }
    }));
  };

  const removeSocial = (index: number) => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev?.contact,
        socials: (prev?.contact?.socials || []).filter((_: { label: string; url: string }, i: number) => i !== index)
      }
    }));
  };

  const updatePhoto = (index: number, field: 'url' | 'alt', value: string) => {
    setData(prev => ({
      ...prev,
      photos: (prev?.photos || []).map((photo: { url: string; alt: string }, i: number) =>
        i === index ? { ...photo, [field]: value } : photo
      )
    }));
  };

  const addPhoto = () => {
    setData(prev => ({
      ...prev,
      photos: [...(prev?.photos || []), { url: '', alt: '' }]
    }));
  };

  const removePhoto = (index: number) => {
    setData(prev => ({
      ...prev,
      photos: (prev?.photos || []).filter((_: { url: string; alt: string }, i: number) => i !== index)
    }));
  };

  return {
    data,
    saveStatus,
    errors,
    saveData,
    updateHero,
    updateAbout,
    updateSkill,
    addSkill,
    removeSkill,
    updateProject,
    updateProjectBackgroundImage,
    removeProjectBackgroundImage,
    addProject,
    removeProject,
    updateContactEmail,
    updateSocial,
    addSocial,
    removeSocial,
    updatePhoto,
    addPhoto,
    removePhoto
  };
};

const AdminPanel = () => {
  // Аутентификация
  const [auth, setAuth] = createSignal<AuthState>({
    isAuthenticated: false,
    password: '',
    error: ''
  });

  const login = (password: string) => {
    if (password === 'admin123') {
      setAuth(prev => ({ ...prev, isAuthenticated: true, error: '' }));
      localStorage.setItem('adminAuth', 'true');
    } else {
      setAuth(prev => ({ ...prev, error: 'Невірний пароль' }));
    }
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, password: '', error: '' });
    localStorage.removeItem('adminAuth');
  };

  // Проверяем сохраненную аутентификацию при загрузке
  onMount(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setAuth(prev => ({ ...prev, isAuthenticated: true }));
    }
  });

  const {
    data,
    saveStatus,
    errors,
    saveData,
    updateHero,
    updateAbout,
    updateSkill,
    addSkill,
    removeSkill,
    updateProject,
    updateProjectBackgroundImage,
    removeProjectBackgroundImage,
    addProject,
    removeProject,
    updateContactEmail,
    updateSocial,
    addSocial,
    removeSocial,
    updatePhoto,
    addPhoto,
    removePhoto
  } = createPortfolioStore();

  return (
    <Show
      when={auth().isAuthenticated}
      fallback={
        <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div class="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
            <h1 class="text-2xl font-bold mb-6 text-center text-sky-400">Вхід в адмін-панель</h1>
            <div class="mb-4">
              <input
                type="password"
                class="w-full rounded p-3 text-gray-900"
                placeholder="Введіть пароль"
                value={auth().password}
                onInput={(e) => {
                  const password = (e.target as HTMLInputElement).value;
                  setAuth(prev => ({ ...prev, password, error: '' }));
                }}
              />
            </div>
            <Show when={auth().error}>
              <div class="mb-4 text-red-400 text-sm">{auth().error}</div>
            </Show>
            <button
              class="w-full bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition"
              onClick={() => {
                login(auth().password);
              }}
            >
              Увійти
            </button>
          </div>
        </div>
      }
    >
      <div class="min-h-screen bg-gray-900 text-white py-12 px-4">
        <div class="max-w-4xl mx-auto">
          {/* Header админ-панели */}
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-sky-400">Адмін-панель портфоліо</h1>
            <div class="flex gap-4">
              <a
                href="/"
                class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                ← На сайт
              </a>
              <button
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                onClick={() => logout()}
              >
                Вийти
              </button>
            </div>
          </div>

          <div class="grid gap-8 md:grid-cols-2">
            {/* Hero Section */}
            <div class="bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-4 text-sky-400">Hero секція</h2>
              <div class="space-y-4">
                <div>
                  <label class="block mb-2 font-semibold">Ім'я:</label>
                  <input
                    class="w-full rounded p-2 text-gray-900"
                    value={data()?.hero?.name || ''}
                    onInput={(e) => updateHero('name', (e.target as HTMLInputElement).value)}
                    placeholder="Ваше ім'я"
                  />
                </div>
                <div>
                  <label class="block mb-2 font-semibold">Слоган:</label>
                  <input
                    class="w-full rounded p-2 text-gray-900"
                    value={data()?.hero?.tagline || ''}
                    onInput={(e) => updateHero('tagline', (e.target as HTMLInputElement).value)}
                    placeholder="Веб-розробник / Frontend"
                  />
                </div>
                <div>
                  <label class="block mb-2 font-semibold">Опис:</label>
                  <textarea
                    class="w-full rounded p-2 text-gray-900"
                    rows={3}
                    value={data()?.hero?.description || ''}
                    onInput={(e) => updateHero('description', (e.target as HTMLTextAreaElement).value)}
                    placeholder="Короткий опис вашої діяльності"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div class="bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-4 text-sky-400">Про себе</h2>
              <textarea
                class="w-full rounded p-3 text-gray-900"
                rows={4}
                value={data()?.about?.text || ''}
                onInput={(e) => updateAbout((e.target as HTMLTextAreaElement).value)}
                placeholder="Розкажіть про себе..."
              />
              <Show when={errors().about}>
                <div class="mt-2 text-red-400 text-sm">{errors().about}</div>
              </Show>
            </div>

            {/* Skills Section */}
            <div class="bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-4 text-sky-400">Навички</h2>
              <For each={data()?.skills || []}>
                {(skill, index) => (
                  <div class="flex gap-2 mb-3">
                    <input
                      class="flex-1 rounded p-2 text-gray-900"
                      value={skill.label}
                      onInput={(e) => updateSkill(index(), (e.target as HTMLInputElement).value)}
                      placeholder="Назва навички"
                    />
                    <button
                      class="bg-red-500 hover:bg-red-600 text-white px-3 rounded"
                      onClick={() => removeSkill(index())}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                )}
              </For>
              <Show when={errors().skills}>
                <div class="mb-3 text-red-400 text-sm">{errors().skills}</div>
              </Show>
              <button
                class="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded transition"
                onClick={addSkill}
                type="button"
              >
                + Додати навичку
              </button>
            </div>

            {/* Projects Section */}
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2">
              <h2 class="text-xl font-bold mb-4 text-sky-400">Проєкти</h2>
              <For each={data()?.projects || []}>
                {(project, index) => (
                  <div class="border border-gray-700 rounded p-4 mb-4">
                    <div class="grid gap-3 md:grid-cols-3">
                      <div>
                        <input
                          class="w-full rounded p-2 text-gray-900"
                          value={project.title}
                          onInput={(e) => updateProject(index(), 'title', (e.target as HTMLInputElement).value)}
                          placeholder="Назва проєкту"
                        />
                        <Show when={errors()[`project_title_${index()}`]}>
                          <div class="mt-1 text-red-400 text-sm">{errors()[`project_title_${index()}`]}</div>
                        </Show>
                      </div>

                      <div class="md:col-span-2">
                        <textarea
                          class="w-full rounded p-2 text-gray-900"
                          value={project.description}
                          onInput={(e) => updateProject(index(), 'description', (e.target as HTMLTextAreaElement).value)}
                          placeholder="Опис проєкту"
                          rows={2}
                        />
                        <Show when={errors()[`project_description_${index()}`]}>
                          <div class="mt-1 text-red-400 text-sm">{errors()[`project_description_${index()}`]}</div>
                        </Show>
                      </div>
                    </div>

                    <div class="mt-3">
                      <input
                        class="w-full rounded p-2 text-gray-900"
                        value={project.link}
                        onInput={(e) => updateProject(index(), 'link', (e.target as HTMLInputElement).value)}
                        placeholder="Посилання на проєкт"
                      />
                    </div>

                    {/* Фоновое изображение проекта */}
                    <div class="mt-3">
                      <label class="block mb-2 font-semibold">Фонове зображення:</label>
                      <div class="flex gap-2 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          class="flex-1 rounded p-2 text-gray-900 bg-white"
                          onChange={async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              await updateProjectBackgroundImage(index(), file);
                              // Сбрасываем значение input для возможности загрузки того же файла
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Show when={project.backgroundImage}>
                          <button
                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            onClick={() => removeProjectBackgroundImage(index())}
                            type="button"
                          >
                            ✕
                          </button>
                        </Show>
                      </div>
                      <Show when={errors()[`project_bg_${index()}`]}>
                        <div class="mt-1 text-red-400 text-sm">{errors()[`project_bg_${index()}`]}</div>
                      </Show>
                      <Show when={project.backgroundImage}>
                        <div class="mt-2">
                          <img
                            src={project.backgroundImage}
                            alt={`Фон проекта ${project.title}`}
                            class="w-full h-24 object-cover rounded border border-gray-600"
                          />
                        </div>
                      </Show>
                    </div>

                    <div class="mt-3 text-right">
                      <button
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                        onClick={() => removeProject(index())}
                        type="button"
                      >
                        Видалити проєкт
                      </button>
                    </div>
                  </div>
                )}
              </For>

              <Show when={errors().projects}>
                <div class="mb-3 text-red-400 text-sm">{errors().projects}</div>
              </Show>

              <button
                class="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded transition"
                onClick={addProject}
                type="button"
              >
                + Додати проєкт
              </button>
            </div>

            {/* Photos Section */}
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2">
              <h2 class="text-xl font-bold mb-4 text-sky-400">Фото профілю</h2>
              <p class="text-gray-300 mb-4">Додайте до 3 фото. При кожному перевантаженні сторінки буде показуватися випадкове фото.</p>

              <For each={data()?.photos || []}>
                {(photo, index) => (
                  <div class="border border-gray-700 rounded p-4 mb-4">
                    <div class="grid gap-3 md:grid-cols-2">
                      <div>
                        <label class="block mb-2 font-semibold">URL фото:</label>
                        <input
                          class="w-full rounded p-2 text-gray-900"
                          value={photo.url}
                          onInput={(e) => updatePhoto(index(), 'url', (e.target as HTMLInputElement).value)}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      <div>
                        <label class="block mb-2 font-semibold">Alt текст:</label>
                        <input
                          class="w-full rounded p-2 text-gray-900"
                          value={photo.alt}
                          onInput={(e) => updatePhoto(index(), 'alt', (e.target as HTMLInputElement).value)}
                          placeholder="Опис фото"
                        />
                      </div>
                    </div>

                    <div class="mt-3 flex justify-between items-center">
                      <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
                        <img
                          src={photo.url}
                          alt={photo.alt}
                          class="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/374151/9CA3AF?text=No+Image';
                          }}
                        />
                      </div>
                      <button
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                        onClick={() => removePhoto(index())}
                        type="button"
                      >
                        Видалити фото
                      </button>
                    </div>
                  </div>
                )}
              </For>

              <Show when={(data()?.photos?.length || 0) < 3}>
                <button
                  class="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded transition"
                  onClick={addPhoto}
                  type="button"
                >
                  + Додати фото
                </button>
              </Show>

              <Show when={(data()?.photos?.length || 0) >= 3}>
                <div class="text-yellow-400 text-sm mt-2">Максимум 3 фото</div>
              </Show>
            </div>

            {/* Contact Section */}
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2">
              <h2 class="text-xl font-bold mb-4 text-sky-400">Контакти</h2>

              <div class="mb-4">
                <label class="block mb-2 font-semibold">Email:</label>
                <input
                  class="w-full rounded p-2 text-gray-900"
                  type="email"
                  value={data()?.contact?.email || ''}
                  onInput={(e) => updateContactEmail((e.target as HTMLInputElement).value)}
                  placeholder="your@email.com"
                />
                <Show when={errors().email}>
                  <div class="mt-1 text-red-400 text-sm">{errors().email}</div>
                </Show>
              </div>

              <div>
                <label class="block mb-2 font-semibold">Соцмережі:</label>
                <For each={data()?.contact?.socials || []}>
                  {(social, index) => (
                    <div class="flex gap-2 mb-3">
                      <input
                        class="flex-1 rounded p-2 text-gray-900"
                        value={social.label}
                        onInput={(e) => updateSocial(index(), 'label', (e.target as HTMLInputElement).value)}
                        placeholder="Назва (Telegram, GitHub...)"
                      />
                      <input
                        class="flex-1 rounded p-2 text-gray-900"
                        value={social.url}
                        onInput={(e) => updateSocial(index(), 'url', (e.target as HTMLInputElement).value)}
                        placeholder="URL"
                      />
                      <button
                        class="bg-red-500 hover:bg-red-600 text-white px-3 rounded"
                        onClick={() => removeSocial(index())}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </For>

                <button
                  class="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded transition"
                  onClick={addSocial}
                  type="button"
                >
                  + Додати соцмережу
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div class="mt-8 text-center">
            <Show
              when={saveStatus() === 'saving'}
              fallback={
                <button
                  class="bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded transition"
                  onClick={saveData}
                >
                  Зберегти зміни
                </button>
              }
            >
              <div class="text-sky-400">Зберігаю...</div>
            </Show>

            <Show when={saveStatus() === 'success'}>
              <div class="text-green-400 mt-2">✅ Дані успішно збережено!</div>
            </Show>

            <Show when={saveStatus() === 'error'}>
              <div class="text-red-400 mt-2">❌ Помилка при збереженні</div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default AdminPanel;
