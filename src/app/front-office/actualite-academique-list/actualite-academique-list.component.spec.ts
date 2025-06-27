import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteAcademiqueListComponent } from './actualite-academique-list.component';

describe('ActualiteAcademiqueListComponent', () => {
  let component: ActualiteAcademiqueListComponent;
  let fixture: ComponentFixture<ActualiteAcademiqueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualiteAcademiqueListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualiteAcademiqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
