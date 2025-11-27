const el = {
    dashboard: "Πίνακας Ελέγχου",
    about: "Σχετικά",
    settings: "Ρυθμίσεις",
    greeting: "Γειά σου!",
    farewell: "Αντίο!",
    goToAbout: "Μετάβαση στη Σελίδα Σχετικά",
    description: "Πατήστε τα βελάκια για να περιηγηθείτε."
} as const;

export type LocaleKeys = keyof typeof el;
export default el;
