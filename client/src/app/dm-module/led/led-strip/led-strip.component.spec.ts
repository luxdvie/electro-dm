import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedStripComponent } from './led-strip.component';

describe('LedStripComponent', () => {
  let component: LedStripComponent;
  let fixture: ComponentFixture<LedStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedStripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
