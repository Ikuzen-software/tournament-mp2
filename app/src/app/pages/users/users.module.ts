import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [UserDetailComponent, UserListComponent],
  imports: [
    CommonModule,
    CarouselModule,
    CardModule,
    HttpClientModule,
    FormsModule,
    MenuModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    SharedModule,
    TooltipModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    PaginatorModule,
    TableModule,
    DataViewModule,
    DropdownModule,
    PanelModule,
    InputTextareaModule,
    TabViewModule,
    ProgressBarModule,
    PanelModule
  ]
})
export class UsersModule { }
