import { TestBed } from '@angular/core/testing';

import { PresseServiceTsService } from './presse.service.ts.service';

describe('PresseServiceTsService', () => {
  let service: PresseServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresseServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
