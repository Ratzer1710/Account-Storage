import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  availableThemes: Array<string> = ['dark', 'light'];

  constructor() {}

  async initialize() {
    document.body.className = await this.getTheme();
  }

  async setTheme(theme: string) {
    if (this.availableThemes.includes(theme)) {
      await invoke('change_theme', { theme });
      document.body.className = theme;
    }
  }

  async getTheme(): Promise<string> {
    return await invoke('get_theme');
  }
}
