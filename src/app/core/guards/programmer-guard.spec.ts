import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { programmerGuard } from './programmer-guard';

describe('programmerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => programmerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
