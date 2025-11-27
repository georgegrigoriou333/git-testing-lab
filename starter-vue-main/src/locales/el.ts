const el = {
    greeting: "Γειά σου Κόσμε",
    farewell: "Αντίο Κόσμε",
    goToAbout: "Μετάβαση στη Σελίδα Σχετικά"
} as const;

export type LocaleKeys = keyof typeof el;
export default el;
