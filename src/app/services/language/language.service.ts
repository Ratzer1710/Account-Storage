import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  availableLanguages: Array<string> = ['en', 'es'];

  constructor(private translate: TranslateService) {}

  async initialize() {
    this.translate.addLangs(this.availableLanguages);
    this.translate.use(await this.getLanguage());
  }

  async setLanguage(language: string) {
    if (this.availableLanguages.includes(language)) {
      await invoke('change_language', { language });
      this.translate.use(language);
    }
  }

  async getLanguage(): Promise<string> {
    return await invoke('get_language');
  }
}
