import { TestBed } from '@angular/core/testing';

import { EstacionamientoService } from './estacionamiento.service';

describe('EstacionamientoService', () => {
  let service: EstacionamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
