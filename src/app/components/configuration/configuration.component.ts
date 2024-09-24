import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemesService } from '../../services/themes/themes.service';
import { LanguageService } from '../../services/language/language.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent {
  @Input() showConfig: boolean = false;
  @Output() closeConfig: EventEmitter<void> = new EventEmitter();

  @ViewChild('themeSelect') themeSelect!: ElementRef;
  @ViewChild('langSelect') langSelect!: ElementRef;

  activeLang: string = '';
  activeTheme: string = '';

  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPasswordError: boolean = false;
  passwordError: string = '';

  showThemeSelect: boolean = false;
  showLangSelect: boolean = false;

  constructor(
    private theme: ThemesService,
    private language: LanguageService,
    private authService: AuthService
  ) {
    this.loadInfo();
  }

  async loadInfo(): Promise<void> {
    this.activeTheme = await this.theme.getTheme();
    this.activeLang = await this.language.getLanguage();
  }

  onClose(): void {
    this.loadInfo();
    this.password = '';
    this.closeConfig.emit();
  }

  async onSave(): Promise<void> {
    this.showPasswordError = false;

    if (this.shouldChangePassword()) {
      if (await this.isValidPassword()) {
        this.authService.changePassword(this.newPassword);
      } else {
        return;
      }
    }

    await this.theme.setTheme(this.activeTheme);
    await this.language.setLanguage(this.activeLang);

    this.onClose();
  }

  private shouldChangePassword(): boolean {
    return this.newPassword !== '';
  }

  private async isValidPassword(): Promise<boolean> {

    if (this.newPassword !== this.confirmPassword) {
      this.showPasswordError = true;
      this.passwordError = 'configuration.password.noMatchError';
      return false;
    }

    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;

    for (let i = 0; i < this.newPassword.length; i++) {
      const char = this.newPassword[i];

      if (char >= 'A' && char <= 'Z') {
        hasUppercase = true;
      } else if (char >= 'a' && char <= 'z') {
        hasLowercase = true;
      } else if (char >= '0' && char <= '9') {
        hasNumber = true;
      }
    }

    if (this.newPassword.length < 8) {
      this.showPasswordError = true;
      this.passwordError = 'configuration.password.lengthError';
      return false;
    }

    if (!hasUppercase) {
      this.showPasswordError = true;
      this.passwordError = 'configuration.password.lowercaseError';
      return false;
    }

    if (!hasLowercase) {
      this.showPasswordError = true;
      this.passwordError = 'configuration.password.uppercaseError';
      return false;
    }

    if (!hasNumber) {
      this.showPasswordError = true;
      this.passwordError = 'configuration.password.numberError';
      return false;
    }

    if (!await this.authService.checkPassword(this.password)) {
      this.showPasswordError = true;
      this.passwordError = 'configuration.password.currentPasswordError';
      return false;
    }

    return true;
  }

  onToggleThemeSelect(): void {
    this.showThemeSelect = !this.showThemeSelect;
  }

  onSelectTheme(theme: string): void {
    this.activeTheme = theme;
    this.hideSelects();
  }

  onToggleLangSelect(): void {
    this.showLangSelect = !this.showLangSelect;
  }

  onSelectLang(lang: string): void {
    this.activeLang = lang;
    this.hideSelects();
  }

  private hideSelects(): void {
    this.showThemeSelect = false;
    this.showLangSelect = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: Event) {
    const target = event.target as HTMLElement;

    if (!this.themeSelect.nativeElement.contains(target)) {
      this.showThemeSelect = false;
    }
   
    if (!this.langSelect.nativeElement.contains(target)) {
      this.showLangSelect = false;
    }
  }
}
