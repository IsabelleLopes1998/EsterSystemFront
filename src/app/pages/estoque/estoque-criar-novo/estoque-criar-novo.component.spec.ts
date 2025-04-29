import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCriarNovoComponent } from './usuario-criar-novo.component';

describe('UsuarioCriarNovoComponent', () => {
  let component: UsuarioCriarNovoComponent;
  let fixture: ComponentFixture<UsuarioCriarNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioCriarNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuarioCriarNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
