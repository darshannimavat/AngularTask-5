import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { homeGuradGuard } from './home-guard.guard';

describe('homeGuradGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => homeGuradGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
