import { TestBed } from '@angular/core/testing';

import { CocherasService } from './cocheras.service';

describe('CocherasService', () => {
  let service: CocherasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocherasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
