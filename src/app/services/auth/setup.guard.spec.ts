import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { setupGuard } from './setup.guard';

describe('setupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => setupGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
