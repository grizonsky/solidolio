
export interface Skill { label: string; }
export interface Project { title: string; description: string; link: string; image?: string; backgroundImage?: string; }
export interface PortfolioData {
  hero: { name: string; tagline: string; description: string; };
  skills: Skill[];
  about: { text: string; };
  photos: Array<{ url: string; alt: string; }>;
  projects: Project[];
  contact: { email: string; socials: { label: string; url: string; }[] };
}


export const defaultPortfolioData: PortfolioData = {
  hero: {
    name: '',
    tagline: '',
    description: ''
  },
  skills: [],
  about: { text: '' },
  photos: [],
  projects: [],
  contact: {
    email: '',
    socials: []
  }
};

export function getPortfolioData(): PortfolioData {
  const saved = localStorage.getItem('portfolioData');
  return saved ? JSON.parse(saved) : defaultPortfolioData;
}

// Функція для збереження даних в localStorage
export const savePortfolioData = (data: PortfolioData) => {
  try {
    localStorage.setItem('portfolioData', JSON.stringify(data));

    // Тригеримо кастомну подію для синхронізації між вкладками
    window.dispatchEvent(new CustomEvent('portfolioDataChanged', {
      detail: data,
      bubbles: true,
      cancelable: true
    }));

    return true;
  } catch (error) {
    return false;
  }
};
