import { TestBed } from '@angular/core/testing';

import { ManifestoService } from './manifesto';

describe('ManifestoService', () => {
  let service: ManifestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManifestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
