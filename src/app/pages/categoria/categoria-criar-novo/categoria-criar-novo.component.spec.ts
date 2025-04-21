import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCriarNovoComponent } from './categoria-criar-novo.component';

describe('CategoriaCriarNovoComponent', () => {
  let component: CategoriaCriarNovoComponent;
  let fixture: ComponentFixture<CategoriaCriarNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaCriarNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriaCriarNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
