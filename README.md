<div align="center">

# Patchwork

**Коллаборативный конструктор контрактов и документов**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://patchwork-phi.vercel.app/)

[Демо](https://patchwork-phi.vercel.app/) · [Сообщить о баге](https://github.com/PCenjoyer/Patchwork/issues) · [Предложить идею](https://github.com/PCenjoyer/Patchwork/issues)

</div>

---

## О проекте

**Patchwork** — это веб-приложение для совместного создания и редактирования контрактов и документов. Собирайте документы из готовых блоков, перетаскивайте и переставляйте разделы, валидируйте содержимое — всё в одном удобном интерфейсе.

Название отражает суть: как лоскутное одеяло собирается из кусочков ткани, так и ваши документы складываются из переиспользуемых блоков.

---

## Возможности

-  **Блочный редактор** — создавайте документы из отдельных переиспользуемых секций
-  **Drag & Drop** — интуитивная перестановка блоков с помощью `@dnd-kit`
-  **Валидация форм** — надёжная проверка данных через `react-hook-form` + `zod`
-  **Маршрутизация** — многостраничная навигация с `react-router-dom`
-  **Уникальные ID** — каждый блок и документ имеет свой идентификатор (`uuid`)
-  **Современный UI** — чистый интерфейс с кастомным CSS

---

## Технологии

| Категория | Технологии |
|-----------|-----------|
| **Frontend** | React 19, TypeScript 6 |
| **Сборка** | Vite 8 |
| **Формы** | React Hook Form, Zod |
| **DnD** | @dnd-kit/core, @dnd-kit/sortable |
| **Роутинг** | React Router DOM v7 |
| **Деплой** | Vercel |

---

##  Быстрый старт

### Предварительные требования

- [Node.js](https://nodejs.org/) v18 или выше
- npm / yarn / pnpm

### Установка и запуск

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/PCenjoyer/Patchwork.git
cd Patchwork

# 2. Установите зависимости
npm install

# 3. Запустите dev-сервер
npm run dev
```

Приложение будет доступно по адресу **http://localhost:5173**

### Доступные команды

```bash
npm run dev        # Запуск dev-сервера с HMR
npm run build      # Сборка для продакшна
npm run preview    # Предпросмотр продакшн-сборки
npm run lint       # Проверка кода линтером
```

---

## Деплой на Vercel

Проект полностью готов к деплою на [Vercel]([https://vercel.com/](https://patchwork-phi.vercel.app/)) без дополнительной настройки.

### Автоматический деплой (рекомендуется)

[![Deploy with Vercel]([https://patchwork-phi.vercel.app/](https://patchwork-phi.vercel.app/))](https://patchwork-phi.vercel.app/)

1. Нажмите кнопку **Deploy with Vercel** выше
2. Авторизуйтесь через GitHub
3. Подтвердите импорт репозитория — Vercel автоматически определит настройки Vite
4. Нажмите **Deploy** 

### Ручной деплой через CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Авторизуйтесь
vercel login

# Деплой
vercel

# Деплой в продакшн
vercel --prod
```

### Настройки проекта на Vercel

Vercel автоматически определяет фреймворк как **Vite**, но если нужно настроить вручную:

| Параметр | Значение |
|----------|---------|
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Структура проекта

```
Patchwork/
├── public/              # Статические файлы
├── src/                 # Исходный код приложения
│   ├── components/      # React-компоненты
│   ├── pages/           # Страницы приложения
│   ├── hooks/           # Кастомные хуки
│   ├── types/           # TypeScript-типы
│   └── main.tsx         # Точка входа
├── index.html           # HTML-шаблон
├── vite.config.ts       # Конфигурация Vite
├── tsconfig.json        # Конфигурация TypeScript
└── package.json         # Зависимости и скрипты
```

---

## Вклад в проект

Вклад приветствуется! Если хотите улучшить Patchwork:

1. Форкните репозиторий
2. Создайте ветку для фичи (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'feat: add amazing feature'`)
4. Запушьте ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

<div align="center">

Сделано с ❤️ by [PCenjoyer](https://github.com/PCenjoyer)

</div>
