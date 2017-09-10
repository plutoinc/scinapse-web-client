import { addLocaleData } from "react-intl";
const enLocaleData = require("react-intl/locale-data/en");
const koLocaleData = require("react-intl/locale-data/ko");

export const SUPPORTED_LANGUAGES = ["en", "ko"];
export const DEFAULT_LANGUAGE = "en";

export const ACTION_TYPES = {
  CHANGE_LOCALE: "LOCALE.CHANGE_LOCALE",
};

interface ITRANSLATIONS {
  [localeCode: string]: any;
}

const TRANSLATIONS: ITRANSLATIONS = {};
for (const locale of SUPPORTED_LANGUAGES) {
  TRANSLATIONS[locale] = require(`./assets/${locale}.json`);
}

export function addLocaleDataSet() {
  const allLocaleData = [...enLocaleData, ...koLocaleData];
  addLocaleData(allLocaleData);
}

export function getMessages(locale: string) {
  let localeData = TRANSLATIONS[locale];
  if (!localeData) {
    localeData = TRANSLATIONS[DEFAULT_LANGUAGE];
  }
  return localeData;
}

export function changeLocale(locale: string, messages: Object) {
  return {
    type: ACTION_TYPES.CHANGE_LOCALE,
    payload: {
      lang: locale,
      messages,
    },
  };
}
