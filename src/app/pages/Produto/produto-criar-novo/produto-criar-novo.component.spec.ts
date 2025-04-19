import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoCriarNovoComponent } from './produto-criar-novo.component';

describe('ProdutoCriarNovoComponent', () => {
  let component: ProdutoCriarNovoComponent;
  let fixture: ComponentFixture<ProdutoCriarNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoCriarNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdutoCriarNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
