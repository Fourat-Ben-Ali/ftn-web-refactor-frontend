import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgammeFormationListComponent } from './progamme-formation-list.component';

describe('ProgammeFormationListComponent', () => {
  let component: ProgammeFormationListComponent;
  let fixture: ComponentFixture<ProgammeFormationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgammeFormationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgammeFormationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
