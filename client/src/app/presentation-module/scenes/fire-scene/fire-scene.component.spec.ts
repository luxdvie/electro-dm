import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireSceneComponent } from './fire-scene.component';

describe('FireSceneComponent', () => {
  let component: FireSceneComponent;
  let fixture: ComponentFixture<FireSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FireSceneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FireSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
