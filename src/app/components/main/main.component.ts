import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../header/header.component';
import { AccountsService } from '../../services/accounts/accounts.service';
import { Account } from '../../services/accounts/account.model';
import { Router } from '@angular/router';
import { ConfigurationComponent } from '../configuration/configuration.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [TranslateModule, CommonModule, HeaderComponent, ConfigurationComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  accounts: Account[] = [];
  pagedAccounts: Account[] = [];
  emptyRows: string[] = [];

  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  deleteMessageAlertTrigger: boolean = false;
  showDeleteMessage: boolean = false;
  deleteAccountId: string = '';

  showConfigurationTrigger: boolean = false;
  showConfiguration: boolean = false;

  constructor(
    private accountsService: AccountsService,
    private router: Router
  ) {
    accountsService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      this.totalPages = Math.ceil(this.accounts.length / this.pageSize);
      this.updatePagination();
    });
  }

  private updatePagination(): void {
    this.emptyRows = [];
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedAccounts = this.accounts.slice(startIndex, endIndex);

    if (this.pagedAccounts.length < this.pageSize) {
      const amountOfEmptyRows = this.pageSize - this.pagedAccounts.length;
      for (let i = 0; i < amountOfEmptyRows; i++) {
        this.emptyRows.push(' ');
      }
    }
  }

  onNavigatePage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  getPlatformIcon(platform: string): string {
    const knownBrands: string[] = [
      'facebook',
      'twitter',
      'instagram',
      'tiktok',
      'linkedin',
      'github',
      'discord',
      'youtuber',
      'slack',
      'figma',
      'apple',
      'google',
      'stripe',
      'algolia',
      'windows',
      'paypal',
      'kickstarter',
      'dribble',
      'dropbox',
      'squarespace',
      'android',
      'shopify',
      'airbnb',
      'vimeo',
      'whatsapp',
      'wix',
      'line',
      'behance',
      'teamspeak',
      'telegram',
      'pinterest',
      'soundcloud',
      'visa',
      'skype',
      'etsy',
      'amazon',
      'gitlab',
      'spotify',
      'microsoft',
      'mastercard',
      'messenger',
      'atlassian',
      'playstation',
      'meetup',
      'twitch',
      'waze',
      'yelp',
      'xbox',
      'yahoo',
      'vk',
      'vine',
      'viber',
      'upwork',
      'ups',
      'uber',
      'tumblr',
      'threads',
      'steam',
      'snapchat',
      'reddit',
      'redhat',
      'quora',
      'periscope',
      'patreon',
      'napster',
      'meta',
      'lyft',
      'letterboxd',
      'itunes',
      'jira',
      'jenkins',
      'imdb',
      'google-pay',
      'google-drive',
      'git',
      'ebay',
      'deezer',
      'chrome',
      'chromecast',
      'discover',
      'amex',
      'amazon-pay',
      'apple-pay',
      'bitbucket',
      'btc',
      'bitcoin',
      'ethereum',
      'aws',
      'audible',
    ];
    platform = platform.toLowerCase();

    if (knownBrands.includes(platform)) {
      if (platform === 'messenger') {
        platform = 'facebook-messenger';
      }

      if (
        platform === 'visa' ||
        platform === 'mastercard' ||
        platform === 'discover' ||
        platform === 'amex'
      ) {
        platform = 'cc' + platform;
      }

      return 'fa-brands fa-' + platform;
    }

    if (
      platform.includes('google') ||
      platform.includes('gmail') ||
      platform.includes('drive')
    ) {
      return 'fa-brands fa-google';
    }

    return 'fa-solid fa-user';
  }

  getPassword(password: string): string {
    let length: number = password.length;

    if (length > 12) {
      length = 12;
    }

    let hiddenPassword: string = '';

    for (let i = 0; i < length; i++) {
      hiddenPassword += '●';
    }

    return hiddenPassword;
  }

  onDeleteAccount(id: string): void {
    this.deleteAccountId = id;
    this.showDeleteMessage = true;
    setTimeout(()=>{
      this.deleteMessageAlertTrigger = true;
    }, 100);
  }

  onEditAccount(id: string): void {
    this.router.navigate(['accounts/edit/' + id]);
  }

  onExport(): void {
    const csvData = this.convertToCSV(this.accounts);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'accounts.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private convertToCSV(accounts: Account[]): string {
    const headers = ['Platform', 'Username', 'Password'];
    const rows = accounts.map(
      (account) => `${account.platform},${account.username},${account.password}`
    );
    return [headers.join(','), ...rows].join('\n');
  }

  onAddAccount(): void {
    this.router.navigate(['accounts/new']);
  }

  onCopy(stringToCopy: string, event: Event): void {
    navigator.clipboard.writeText(stringToCopy);
    let button = event.target as HTMLElement;

    if (button.tagName.toLowerCase() === 'button') {
      const firstChild = button.firstElementChild as HTMLElement;
      if (firstChild) {
        button = firstChild;
      }
    }

    button.className = 'active fa-solid fa-check';
    setTimeout(() => {
      button.className = 'fa-regular fa-copy';
    }, 2000);
  }

  onCancel(): void {
    setTimeout(()=>{
      this.showDeleteMessage = false;
    }, 500);
    this.deleteMessageAlertTrigger = false;
    this.deleteAccountId = '';
  }

  onConfirmDelete(): void {
    this.accountsService.deleteAccount(this.deleteAccountId);
    this.onCancel();
  }

  onExitConfig(): void {
    setTimeout(()=>{
      this.showConfiguration = false;
    }, 500);
    this.showConfigurationTrigger = false;
  }

  onConfig(): void {
    this.showConfiguration = true;
    setTimeout(()=>{
      this.showConfigurationTrigger = true;
    }, 100);
  }
}
