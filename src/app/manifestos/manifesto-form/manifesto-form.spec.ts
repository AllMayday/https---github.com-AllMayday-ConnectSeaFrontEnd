import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestoForm } from './manifesto-form';

describe('ManifestoForm', () => {
  let component: ManifestoForm;
  let fixture: ComponentFixture<ManifestoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifestoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManifestoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
