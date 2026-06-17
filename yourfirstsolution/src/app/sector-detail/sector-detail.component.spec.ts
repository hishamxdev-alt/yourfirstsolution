import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorDetailComponent } from './sector-detail.component';

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [SectorDetailComponent],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of({ get: () => 'sector' }), // Mock parameters
        },
      },
    ],
  }).compileComponents();
});