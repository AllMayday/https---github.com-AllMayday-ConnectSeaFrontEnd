import { TestBed } from '@angular/core/testing';

import { Navio } from './navio';

describe('Navio', () => {
  let service: Navio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Navio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
