import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationLayerComponent } from './animation-layer.component';

describe('AnimationLayerComponent', () => {
  let component: AnimationLayerComponent;
  let fixture: ComponentFixture<AnimationLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
