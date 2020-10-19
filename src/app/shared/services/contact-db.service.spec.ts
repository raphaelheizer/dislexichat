import { TestBed } from '@angular/core/testing';

import { ContactDbService } from './contact-db.service';

describe('ContactDbService', () => {
  let service: ContactDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
