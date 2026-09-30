import { en } from './en';
import { de } from './de';
export type Locale = 'en' | 'de';
export const copy = { en, de };
export const pageUrl = (locale: Locale, path = '') => `${locale === 'de' ? '/de/' : '/'}${path ? path + '/' : ''}`;
