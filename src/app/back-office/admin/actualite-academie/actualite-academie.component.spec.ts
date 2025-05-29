import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteAcademieComponent } from './actualite-academie.component';

describe('ActualiteAcademieComponent', () => {
  let component: ActualiteAcademieComponent;
  let fixture: ComponentFixture<ActualiteAcademieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualiteAcademieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualiteAcademieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
