import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemesService } from './services/themes/themes.service';
import { LanguageService } from './services/language/language.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  inactivityTimeout: any;

  constructor(themeService: ThemesService, languageService: LanguageService, private auth: AuthService, private router: Router) {
    themeService.initialize();
    languageService.initialize();
  }

  ngOnInit() {
    this.resetInactivityTimer();

    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
    window.addEventListener('click', this.resetInactivityTimer.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.removeEventListener('keydown', this.resetInactivityTimer.bind(this));
    window.removeEventListener('click', this.resetInactivityTimer.bind(this));
    clearTimeout(this.inactivityTimeout);
  }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.auth.logout();
      this.router.navigate(['login']);
    }, 180000);
  }
}
