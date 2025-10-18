import { usePortfolio } from '../App';

/**
 * Кастомный хук для получения данных портфолио
 * Унифицирует повторяющуюся логику получения данных из контекста
 */
export const usePortfolioData = () => {
  const portfolio = usePortfolio();
  return portfolio?.data;
};