import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LEDComponent } from './led.component';

describe('LEDComponent', () => {
  let component: LEDComponent;
  let fixture: ComponentFixture<LEDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LEDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LEDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
