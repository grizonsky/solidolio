
# 🚀 Modern Portfolio — SolidJS + Tailwind CSS

Односторінковий портфоліо з секціями Skills, About Me, Projects, Contact. Яскравий дизайн, плавна навігація, анімації, адаптивність, контактна форма через EmailJS.

## Секції
- **Skills** — ваші ключові навички
- **About Me** — коротко про себе
- **Projects** — приклади проєктів
- **Contact** — форма для зв'язку

## Запуск локально

```bash
npm install
npm run dev
```
Відкрийте [http://localhost:5173](http://localhost:5173) у браузері.

## Налаштування EmailJS
1. Зареєструйтесь на [EmailJS](https://www.emailjs.com/)
2. Створіть сервіс, шаблон та отримайте `SERVICE_ID`, `TEMPLATE_ID`, `USER_ID`
3. Вкажіть ці значення у файлі `src/components/Contact.tsx`:
	```ts
	const SERVICE_ID = 'your_service_id';
	const TEMPLATE_ID = 'your_template_id';
	const USER_ID = 'your_user_id';
	```

## Збірка для продакшн

```bash
npm run build
```
Файли будуть у папці `dist`.

## Деплой на Netlify/Vercel
- **Netlify**: просто оберіть репозиторій, Netlify автоматично розпізнає Vite-проєкт
- **Vercel**: імпортуйте репозиторій, оберіть фреймворк Vite
- Build command: `npm run build`
- Output folder: `dist`

## Технології
- SolidJS
- Tailwind CSS
- Vite
- EmailJS

---
_Всі стилі, анімації та компоненти легко змінюються під ваші потреби!_
