import { useLanguage } from "@/Context/LanguageContext";
import translations from "@/translations/index";

/**
 * Translation hook — returns a `t()` function.
 * Usage: const t = useT();  t("erp.heroTitle")
 */
export function useT() {
    const { language } = useLanguage();

    return (key) => {
        const parts = key.split(".");
        let value = translations;
        for (const part of parts) {
            value = value?.[part];
        }
        if (value && typeof value === "object" && value[language]) {
            return value[language];
        }
        if (value && typeof value === "object" && value.en) {
            return value.en;
        }
        return key;
    };
}
