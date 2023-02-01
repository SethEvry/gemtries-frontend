import { TestBed } from '@angular/core/testing';

import { GemtryService } from './gemtry.service';

describe('GemtryService', () => {
  let service: GemtryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GemtryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
