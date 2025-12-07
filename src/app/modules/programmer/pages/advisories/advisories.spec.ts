import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advisories } from './advisories';

describe('Advisories', () => {
  let component: Advisories;
  let fixture: ComponentFixture<Advisories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Advisories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Advisories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
