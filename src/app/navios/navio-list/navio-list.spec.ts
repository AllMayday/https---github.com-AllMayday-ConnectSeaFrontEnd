import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavioList } from './navio-list';

describe('NavioList', () => {
  let component: NavioList;
  let fixture: ComponentFixture<NavioList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavioList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavioList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
