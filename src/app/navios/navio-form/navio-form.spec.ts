import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavioForm } from './navio-form';

describe('NavioForm', () => {
  let component: NavioForm;
  let fixture: ComponentFixture<NavioForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavioForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavioForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
