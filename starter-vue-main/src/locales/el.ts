const el = {
    dashboard: "Αρχική",
    about: "Σχετικά",
    settings: "Ρυθμίσεις",
    greeting: "Γειά σου!",
    farewell: "Αντίο!",
    goToAbout: "Μετάβαση στη Σελίδα Σχετικά",
    description: "Πατήστε τα βελάκια για να περιηγηθείτε.",
    message: {
        reachedPoint20: "Εξερευνήστε τα Απόβλητα στην Αρχαιότητα;"
    }
} as const;

export type LocaleKeys = keyof typeof el;
export default el;
