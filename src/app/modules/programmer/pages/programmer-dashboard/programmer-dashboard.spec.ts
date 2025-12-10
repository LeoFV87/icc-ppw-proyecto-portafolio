import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammerDashboard } from './programmer-dashboard';

describe('ProgrammerDashboard', () => {
  let component: ProgrammerDashboard;
  let fixture: ComponentFixture<ProgrammerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammerDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammerDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
