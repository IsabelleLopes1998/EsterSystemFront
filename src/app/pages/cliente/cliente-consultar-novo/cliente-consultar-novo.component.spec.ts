import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteConsultarNovoComponent } from './cliente-consultar-novo.component';

describe('ClienteCriarNovoComponent', () => {
  let component: ClienteConsultarNovoComponent;
  let fixture: ComponentFixture<ClienteConsultarNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteConsultarNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteConsultarNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
