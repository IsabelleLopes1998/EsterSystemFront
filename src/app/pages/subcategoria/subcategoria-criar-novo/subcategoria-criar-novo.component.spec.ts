import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriaCriarNovoComponent } from './subcategoria-criar-novo.component';

describe('SubcategoriaCriarNovoComponent', () => {
  let component: SubcategoriaCriarNovoComponent;
  let fixture: ComponentFixture<SubcategoriaCriarNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoriaCriarNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubcategoriaCriarNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
