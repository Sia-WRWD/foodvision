import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { HistoryComponent } from './history/history.component';
import { AMModule } from 'src/app/am.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { foodNamePipe } from '../shared/validators/name.pipe';



@NgModule({
  declarations: [
    ProfileComponent,
    RegisterComponent,
    LoginComponent,
    BookmarkComponent,
    HistoryComponent,
    ForgotPasswordComponent,
    foodNamePipe
  ],
  imports: [
    CommonModule,
    AMModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ProfileComponent,
    RegisterComponent,
    LoginComponent,
    BookmarkComponent,
    HistoryComponent
  ]
})
export class UserModule { }
