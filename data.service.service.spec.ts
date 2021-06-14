import { TestBed } from '@angular/core/testing';

import { Data.ServiceService } from './data.service.service';

describe('Data.ServiceService', () => {
  let service: Data.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Data.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
