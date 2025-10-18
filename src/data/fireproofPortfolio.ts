import { fireproof } from 'use-fireproof';

export interface PortfolioContent {
  hero: {
    name: string;
    tagline: string;
    description: string;
  };
  skills: Array<{ label: string }>;
  about: {
    text: string;
  };
  photos: Array<{
    url: string;
    alt: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    link: string;
    image?: string;
    backgroundImage?: string;
  }>;
  contact: {
    email: string;
    socials: Array<{ label: string; url: string }>;
  };
}

// Ініціалізуємо базу даних
const db = fireproof('portfolio-content');

export async function getPortfolioContent(): Promise<PortfolioContent | null> {
  try {
    const doc = await db.get('main');
    return doc as unknown as PortfolioContent;
  } catch (e) {
    return null;
  }
}

export async function setPortfolioContent(data: PortfolioContent): Promise<void> {
  await db.put({ _id: 'main', ...data });
}

export async function initializeWithDefaultData(): Promise<void> {
  try {
    await getPortfolioContent();
  } catch (e) {
    // Если данных нет, создаем дефолтные
    const defaultData: PortfolioContent = {
      hero: {
        name: '',
        tagline: '',
        description: ''
      },
      skills: [],
      about: {
        text: ''
      },
      photos: [],
      projects: [],
      contact: {
        email: '',
        socials: []
      }
    };
    await setPortfolioContent(defaultData);
  }
}