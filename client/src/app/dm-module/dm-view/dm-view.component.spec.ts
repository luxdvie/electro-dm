import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmViewComponent } from './dm-view.component';

describe('DmViewComponent', () => {
  let component: DmViewComponent;
  let fixture: ComponentFixture<DmViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
