import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposListaComponent } from './equipos-lista.component';

describe('EquiposListaComponent', () => {
  let component: EquiposListaComponent;
  let fixture: ComponentFixture<EquiposListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
