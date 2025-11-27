import en from "../locales/en";
import el from "../locales/el";

const messages = {
    en,
    el,
} as const;

export type Locale = keyof typeof messages; // 'en' | 'el'
export type MessageKeys<L extends Locale> = keyof typeof messages[L]; // keys of selected locale

export default messages;