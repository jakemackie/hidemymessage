import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Load saved language from localStorage, default to 'en'
const savedLocale = localStorage.getItem('language') || 'en';

export default createI18n({
  legacy: false,          // composition API friendly
  locale: savedLocale,    // use saved language
  fallbackLocale: "en",
  messages: {
    en,
    fr,
  },
});
