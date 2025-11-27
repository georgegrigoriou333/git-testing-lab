const en = {
    dashboard: "Dashboard",
    about: "About",
    settings: "Settings",
    greeting: "Hello!",
    farewell: "Goodbye!",
    goToAbout: "Go to About Page",
    description: "Use the arrows to navigate.",
    message: {
        reachedPoint20: "Explore Waste in Ancient Times?"
    }

} as const;

export type LocaleKeys = keyof typeof en;
export default en;