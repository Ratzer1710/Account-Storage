import { Component } from '@angular/core';
import { Account } from '../../services/accounts/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../services/accounts/accounts.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [TranslateModule, FormsModule, CommonModule],
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.scss',
})
export class EditAccountComponent {
  account: Account = {
    platform: '',
    username: '',
    password: '',
    id: '',
  };

  accountId: string = '';

  constructor(
    private router: Router,
    private accountsService: AccountsService,
    route: ActivatedRoute
  ) {
    route.params.subscribe((params) => {
      this.accountId = params['id'];
      const account = this.accountsService.getAccountById(this.accountId);
      if (account) {
        this.account = account;
      } else {
        router.navigate(['']);
      }
    });
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

  onEdit(): void {
    this.accountsService.editAccount(this.accountId, this.account);
    this.router.navigate(['']);
  }
}
