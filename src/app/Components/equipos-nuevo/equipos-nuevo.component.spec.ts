import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposNuevoComponent } from './equipos-nuevo.component';

describe('EquiposNuevoComponent', () => {
  let component: EquiposNuevoComponent;
  let fixture: ComponentFixture<EquiposNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposNuevoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
