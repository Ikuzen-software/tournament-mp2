import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BracketTreeComponent } from './components/bracket-tree/bracket-tree.component';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { ValidationErrorComponent } from './validation/validation-error/validation-error.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TreeDragDropService } from 'primeng/api';
import { DragOrderListComponent } from './components/drag-order-list/drag-order-list.component';
import {ListboxModule} from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ScoreDialogComponent } from './components/score-dialog/score-dialog.component';



@NgModule({
  declarations: [
    BracketTreeComponent,
    ValidationErrorComponent,
    DragOrderListComponent,
    ScoreDialogComponent,
    ScoreDialogComponent
  ],
  providers:[
    TreeDragDropService
  ]
  ,
  imports: [
    CommonModule,
    ToastModule,
    TreeModule,
    ButtonModule,
    MatTooltipModule,
    ListboxModule,
    OrderListModule,
    DialogModule,
    ReactiveFormsModule

  ],
  exports:[
    BracketTreeComponent,
    ToastModule,
    ValidationErrorComponent,
    DragOrderListComponent,
    ScoreDialogComponent
  ]
})
export class SharedModule { }
