import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [FormsModule, TranslateModule, CommonModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
  password: string = '';
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSetup(): void {
    this.showError = false;

    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;

    for (let i = 0; i < this.password.length; i++) {
      const char = this.password[i];

      if (char >= 'A' && char <= 'Z') {
        hasUppercase = true;
      } else if (char >= 'a' && char <= 'z') {
        hasLowercase = true;
      } else if (char >= '0' && char <= '9') {
        hasNumber = true;
      }
    }

    if (this.password.length < 8) {
      this.showError = true;
      this.errorMessage = 'configuration.password.lengthError';
      return;
    }

    if (!hasUppercase) {
      this.showError = true;
      this.errorMessage = 'configuration.password.lowercaseError';
      return;
    }

    if (!hasLowercase) {
      this.showError = true;
      this.errorMessage = 'configuration.password.uppercaseError';
      return;
    }

    if (!hasNumber) {
      this.showError = true;
      this.errorMessage = 'configuration.password.numberError';
      return;
    }

    this.authService.activate(this.password);
    this.router.navigate(['login']);
  }
}
