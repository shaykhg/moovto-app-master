import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth-guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tab-module/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./misc-module/onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'notifications',
    loadChildren: () => import('./misc-module/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'track',
    loadChildren: () => import('./misc-module/track/track.module').then(m => m.TrackPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./tab-module/home/home.module').then(m => m.HomePageModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'add',
    loadChildren: () => import('./tab-module/add/add.module').then(m => m.AddPageModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'history',
    loadChildren: () => import('./tab-module/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'profile',
    loadChildren: () => import('./tab-module/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'misc',
    loadChildren: () => import('./misc-module/misc.module').then(m => m.MiscModule)
  },
  {
    // canActivate: [AuthGuard],
    path: 'order',
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'payment',
    loadChildren: () => import('./payment-module/payment.module').then(m => m.PaymentModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'edit-profile',
    loadChildren: () => import('./tab-module/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
