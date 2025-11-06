import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'entreprises',
        loadChildren: () =>
          import('./modules/entreprises/entreprises.module').then(
            (m) => m.EntreprisesModule
          ),
      },
      {
        path: 'opportunites',
        loadChildren: () =>
          import('./modules/opportunites/opportunites.module').then(
            (m) => m.OpportunitesModule
          ),
      },
      {
        path: 'objectifs',
        loadChildren: () =>
          import('./modules/objectifs/objectifs.module').then(
            (m) => m.ObjectifsModule
          ),
      },
      {
        path: 'formateurs',
        loadChildren: () =>
          import('./modules/formateurs/formateurs.module').then(
            (m) => m.FormateursModule
          ),
      },
      {
        path: 'administration',
        loadChildren: () =>
          import('./modules/administration/administration.module').then(
            (m) => m.AdministrationModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
