const en = {
    greeting: "Hello World",
    farewell: "Goodbye World",
    goToAbout: "Go to About Page"
} as const;

export type LocaleKeys = keyof typeof en;
export default en;