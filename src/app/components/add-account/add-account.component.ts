import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from '../../services/accounts/accounts.service';
import { Account } from '../../services/accounts/account.model';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [TranslateModule, FormsModule, CommonModule],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss'
})
export class AddAccountComponent {
  account: Account = {
    platform: '',
    username: '',
    password: '',
    id: '',
  };

  accountId: string = '';

  constructor(
    private router: Router,
    private accountsService: AccountsService
  ) {
  }

  onCancel(): void {
    this.account = {
      platform: '',
      username: '',
      password: '',
      id: '',
    };
    this.router.navigate(['']);
  }

  onAdd(): void {
    this.accountsService.addAccount(this.account);
    this.router.navigate(['']);
  }
}
