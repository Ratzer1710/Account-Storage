import { Routes } from '@angular/router';
import { SetupComponent } from './components/setup/setup.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { setupGuard } from './services/auth/setup.guard';
import { authGuard } from './services/auth/auth.guard';
import { loginGuard } from './services/auth/login.guard';

export const routes: Routes = [
    { path: 'setup', component: SetupComponent, canActivate: [setupGuard] },
    { path: 'configuration', component: ConfigurationComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: '', component: MainComponent, canActivate: [authGuard] },
    { path: 'accounts/new', component: AddAccountComponent, canActivate: [authGuard] },
    { path: 'accounts/edit/:id', component: EditAccountComponent, canActivate: [authGuard] }
];
