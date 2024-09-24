import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService{
  loginSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLogged$: Observable<boolean> = this.loginSubject.asObservable();

  constructor(){
  }

  async isActive(): Promise<boolean> {
    return await invoke('is_active');
  }

  async checkPassword(password: string): Promise<boolean> {
    return await invoke('check_password', { password });
  }

  async activate(password: string): Promise<void> {
    await invoke('activate', { password });
  }

  async login(password: string): Promise<boolean> {
    const isLogged = await this.checkPassword(password);
    this.loginSubject.next(isLogged);
    return isLogged;
  }

  async changePassword(password: string): Promise<void> {
    await invoke('change_password', { password });
  }

  logout(): void {
    this.loginSubject.next(false);
  }
}