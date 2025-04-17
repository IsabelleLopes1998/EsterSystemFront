import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCriarNovoComponent } from './cliente-criar-novo.component';

describe('ClienteCriarNovoComponent', () => {
  let component: ClienteCriarNovoComponent;
  let fixture: ComponentFixture<ClienteCriarNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCriarNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteCriarNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
