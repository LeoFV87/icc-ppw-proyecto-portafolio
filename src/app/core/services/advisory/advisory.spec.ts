import { TestBed } from '@angular/core/testing';
import { AdvisoryService } from './advisory';
import { Firestore } from '@angular/fire/firestore';

describe('AdvisoryService', () => {

  let service: AdvisoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({

      providers: [
        { provide: Firestore, useValue: {} }
      ]
    });
    service = TestBed.inject(AdvisoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
