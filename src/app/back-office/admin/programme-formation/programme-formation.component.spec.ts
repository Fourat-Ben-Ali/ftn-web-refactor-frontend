import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeFormationComponent } from './programme-formation.component';

describe('ProgrammeFormationComponent', () => {
  let component: ProgrammeFormationComponent;
  let fixture: ComponentFixture<ProgrammeFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgrammeFormationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgrammeFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
