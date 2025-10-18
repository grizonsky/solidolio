
import { createSignal, createContext, useContext, onMount } from 'solid-js';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HeroSection from './components/HeroSection';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { getPortfolioData } from './data/portfolioData';
import type { PortfolioData } from './data/portfolioData';
import { getPortfolioContent, initializeWithDefaultData } from './data/fireproofPortfolio';

// Создаем контекст для данных портфолио
interface PortfolioContextType {
  data: () => PortfolioData;
  updateData: (data: PortfolioData) => void;
}

export const PortfolioContext = createContext<PortfolioContextType>();

export const usePortfolio = () => useContext(PortfolioContext);

function App() {
  const [data, setData] = createSignal<PortfolioData>(getPortfolioData());

  const updateData = (newData: PortfolioData) => {
    setData(newData);
  };

  // Слухаємо зміни в localStorage для синхронізації між вкладками
  onMount(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolioData' && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Помилка парсингу даних портфоліо:', error);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      setData(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolioDataChanged', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolioDataChanged', handleCustomEvent as EventListener);
    };
  });

  // Fireproof: асинхронно отримуємо дані при старті
  onMount(async () => {
    try {
      // Ініціалізуємо дані при першому запуску
      await initializeWithDefaultData();

      // Отримуємо дані з Fireproof
      const fireproofData = await getPortfolioContent();
      if (fireproofData) {
        setData(fireproofData as PortfolioData);
      }
    } catch (error) {
      console.error('Помилка завантаження даних з Fireproof:', error);
      // Fallback до localStorage даних
      setData(getPortfolioData());
    }
  });

  return (
    <PortfolioContext.Provider value={{ data, updateData }}>
      <div class="bg-gray-900 text-white font-sans antialiased">
        <Header />
        <main class="container mx-auto px-6 pt-24">
          <HeroSection />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </PortfolioContext.Provider>
  );
}

export default App;
