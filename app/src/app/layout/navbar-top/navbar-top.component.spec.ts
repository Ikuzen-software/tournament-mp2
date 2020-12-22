import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTopComponent } from './navbar-top.component';
import { RouterTestingModule } from 'node_modules/@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Store, StoreModule, MemoizedSelector } from '@ngrx/store';
import { reducer } from 'src/app/reducers/login-page.reducer';
import { MessageService } from 'primeng/api';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthGuard } from '../../auth/auth.guard';
import * as fromAuth from '@reducers/login-page.reducer'
import { By } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';

describe('NavbarTopComponent', () => {
  let component: NavbarTopComponent;
  let fixture: ComponentFixture<NavbarTopComponent>;
  let mockStore: MockStore;
  const initialState = {
    currentUser: {
      id: "",
      role: "guest",
      username: ""
    }
  }
  let guard: AuthGuard;
  let mockUsernameSelector: MemoizedSelector<fromAuth.ApplicationState, string>;
  const queryDivText = () =>
    fixture.debugElement.queryAll(By.css('div'))[0].nativeElement.textContent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarTopComponent],
      imports:
        [
          LayoutModule,
          RouterTestingModule,
          HttpClientTestingModule,
        ],
      providers: [
        MessageService,
        provideMockStore({ initialState })
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(NavbarTopComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    guard = TestBed.inject(AuthGuard);
    fixture.detectChanges();
  }));

  it('should create', () => {
    
    expect(component).toBeTruthy();
  });

  // it('ngOnInit should subscribe to store state',()=>{

  //   spyOn(component,'refreshItems')
  //   component.ngOnInit();
  //   //THEN


  // })
});
