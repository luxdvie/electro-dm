import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmPlayerComponent } from './dm-player.component';

describe('DmPlayerComponent', () => {
  let component: DmPlayerComponent;
  let fixture: ComponentFixture<DmPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
