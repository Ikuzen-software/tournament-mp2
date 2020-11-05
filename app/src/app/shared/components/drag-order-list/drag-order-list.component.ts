import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drag-order-list',
  templateUrl: './drag-order-list.component.html',
  styleUrls: ['./drag-order-list.component.scss']
})
export class DragOrderListComponent implements OnInit {
  @Input() list: any[];
  constructor() { }

  ngOnInit(): void {
  }

}
