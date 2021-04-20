import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookPublicoComponent } from './notebook-publico.component';

describe('NotebookPublicoComponent', () => {
  let component: NotebookPublicoComponent;
  let fixture: ComponentFixture<NotebookPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotebookPublicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
