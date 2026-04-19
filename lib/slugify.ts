// lib/slugify.ts

// Транслітерація кирилиці в латиницю
export function transliterate(text: string): string {
  const cyrillicToLatin: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ie', 'ж': 'zh',
    'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'iu', 'я': 'ia',
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'h', 'Ґ': 'g', 'Д': 'd', 'Е': 'e', 'Є': 'ie', 'Ж': 'zh',
    'З': 'z', 'И': 'y', 'І': 'i', 'Ї': 'i', 'Й': 'i', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n',
    'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'kh', 'Ц': 'ts',
    'Ч': 'ch', 'Ш': 'sh', 'Щ': 'shch', 'Ь': '', 'Ю': 'iu', 'Я': 'ia'
  };
  
  return text.split('').map(char => cyrillicToLatin[char] || char).join('');
}

// Генерація slug з назви (тільки латиниця)
export function generateSlug(text: string): string {
  if (!text || typeof text !== "string") return "";
  
  return text
    .trim()
    .toLowerCase()
    .split('')
    .map(char => {
      const transliterated = transliterate(char);
      if (/[a-z0-9]/.test(transliterated)) return transliterated;
      if (/\s/.test(char)) return '-';
      return '';
    })
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}