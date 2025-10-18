/**
 * Утилита для работы с изображениями
 * Конвертация файлов в base64 для хранения в localStorage
 */

/**
 * Конвертирует файл изображения в base64 строку
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Проверяет, является ли строка base64 изображением
 */
export const isBase64Image = (str: string): boolean => {
  return str.startsWith('data:image/') && str.includes('base64');
};

/**
 * Получает размер файла в байтах из base64 строки
 */
export const getBase64Size = (base64String: string): number => {
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  return Math.round((base64Length * 3) / 4);
};

/**
 * Проверяет, не превышает ли размер изображения максимум (5MB)
 */
export const validateImageSize = (base64String: string): { valid: boolean; size: number; error?: string } => {
  const size = getBase64Size(base64String);
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (size > maxSize) {
    return {
      valid: false,
      size,
      error: `Размер изображения ${Math.round(size / 1024 / 1024)}MB превышает максимум 5MB`
    };
  }

  return { valid: true, size };
};