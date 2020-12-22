import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersModule } from './users.module';
import { UsersComponent } from './users.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'list',
        component: UserListComponent
      },
      {
        path: 'detail/:id',
        component: UserDetailComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    UsersModule,
    RouterModule.forChild(routes)
  ]
})
export class UserRoutingModule { }
