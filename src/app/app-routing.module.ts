import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { HomeComponent } from './pages/home/home.component';
import { InformationComponent } from './pages/information/information.component';
import { SearchComponent } from './pages/search/search.component';
import { ImageEditorComponent } from './pages/search/image-editor/image-editor.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { RegisterComponent } from './pages/user/register/register.component';
import { LoginComponent } from './pages/user/login/login.component';
import { AuthGuard } from './pages/user/auth-guard.service';
import { LoginGuard } from './pages/user/login-guard.service';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { ForgotPasswordComponent } from './pages/user/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'information',
    component: InformationComponent
  },
  {
    path: 'image-editor',
    component: ImageEditorComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'recipe',
    component: RecipeComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: Error404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
