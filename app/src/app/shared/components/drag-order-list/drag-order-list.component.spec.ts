import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragOrderListComponent } from './drag-order-list.component';

describe('DragOrderListComponent', () => {
  let component: DragOrderListComponent;
  let fixture: ComponentFixture<DragOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
