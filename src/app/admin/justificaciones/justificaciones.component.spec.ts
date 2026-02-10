import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificacionesComponent } from './justificaciones.component';

describe('JustificacionesComponent', () => {
  let component: JustificacionesComponent;
  let fixture: ComponentFixture<JustificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
