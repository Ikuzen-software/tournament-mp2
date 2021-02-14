import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { TournamentService } from './tournament.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

describe('TournamentService', () => {
  let service: TournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ],
      providers:[
        MessageService,
        Store
      ]
    });
    service = TestBed.inject(TournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('',()=>{
    expect(1).toBe(1)
  })
});
