import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestoList } from './manifesto-list';

describe('ManifestoList', () => {
  let component: ManifestoList;
  let fixture: ComponentFixture<ManifestoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifestoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManifestoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
