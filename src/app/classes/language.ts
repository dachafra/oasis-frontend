export class Language {
    public static language = 'nl_BE';

    getLanguageData() {
        try {
            const language = require(`../../locales/${Language.language}.json`);
            return language;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    getMessage(key: string) {
        const lang = this.getLanguageData();
        if (lang) {
            return lang[key];
        }
        return null;
    }

    getLanguages(): string[] {
      try {
        const file = require('../../locales/languages.json');
        return file["languages"];
      } catch (e) {
          console.log(e);
          return null;
      }
    }
}