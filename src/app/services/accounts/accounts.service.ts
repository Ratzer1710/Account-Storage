import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Account } from './account.model';
import { invoke } from '@tauri-apps/api/tauri';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  accounts$: Observable<Account[]> = this.accountsSubject.asObservable();

  constructor() {
    this.loadAccounts();
  }

  private async loadAccounts() {
    try {
      const accounts = await invoke<Account[]>('read_json');
      this.accountsSubject.next(accounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  }

  getAccounts(): Observable<Account[]> {
    return this.accounts$;
  }

  getAccountById(id: string): Account | undefined {
    return this.accountsSubject.getValue().find(account => account.id === id);
  }

  async addAccount(account: Account): Promise<void> {
    const currentAccounts = this.accountsSubject.getValue();
    account.id = this.getNewId();
    currentAccounts.push(account);
    await this.updateAccounts(currentAccounts);
  }

  private getNewId(): string {
    let id: string;
    const existingIds = new Set(this.accountsSubject.getValue().map(account => account.id));

    do {
      id = uuid();
    } while (existingIds.has(id));

    return id;
  }

  async editAccount(id: string, updatedAccount: Account): Promise<void> {
    const currentAccounts = this.accountsSubject.getValue();
    const index = currentAccounts.findIndex(account => account.id === id);
    if (index !== -1) {
      updatedAccount.id = id;
      currentAccounts[index] = updatedAccount;
      await this.updateAccounts(currentAccounts);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    const currentAccounts = this.accountsSubject.getValue();
    const updatedAccounts = currentAccounts.filter(account => account.id !== id);
    await this.updateAccounts(updatedAccounts);
  }

  private async updateAccounts(accounts: Account[]): Promise<void> {
    try {
      await invoke('write_json', { accounts });
      this.accountsSubject.next(accounts);
    } catch (error) {
      console.error('Error updating accounts:', error);
    }
  }
}
