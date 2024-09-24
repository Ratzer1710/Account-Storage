import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  password: string = '';
  showError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  async onLogin() {
    this.showError = false;

    const isLogged = await this.authService.login(this.password);

    if (isLogged) {
      this.router.navigate(['']);
    } else {
      this.password = '';
      this.showError = true;
    }
  }
}
