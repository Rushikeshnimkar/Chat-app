interface TranslationLanguageOptions {
    targetLanguage: string;
    sourceLanguage: string;
  }
  
  class TranslationService {
    private translator: any = null;
  
    async init(sourceLang: string, targetLang: string) {
      try {
        // Check if the Translation API is available
        if (!('translation' in window)) {
          throw new Error('Translation API is not available');
        }
  
        const languagePair: TranslationLanguageOptions = {
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        };
  
        // @ts-ignore - Translation API is experimental
        const canTranslate = await window.translation.canTranslate(languagePair);
  
        if (canTranslate === 'no') {
          throw new Error('Translation is not available for this language pair');
        }
  
        // @ts-ignore - Translation API is experimental
        this.translator = await window.translation.createTranslator(languagePair);
        return true;
      } catch (error) {
        console.error('Translation initialization error:', error);
        return false;
      }
    }
  
    async translate(text: string): Promise<string> {
      try {
        if (!this.translator) {
          throw new Error('Translator not initialized');
        }
  
        const translatedText = await this.translator.translate(text);
        return translatedText;
      } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text if translation fails
      }
    }
  
    isInitialized(): boolean {
      return !!this.translator;
    }
  }
  
  export const translationService = new TranslationService();