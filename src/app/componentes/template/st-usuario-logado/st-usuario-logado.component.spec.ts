import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StUsuarioLogadoComponent } from './st-usuario-logado.component';

describe('StUsuarioLogadoComponent', () => {
  let component: StUsuarioLogadoComponent;
  let fixture: ComponentFixture<StUsuarioLogadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StUsuarioLogadoComponent]
    });
    fixture = TestBed.createComponent(StUsuarioLogadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
