import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPuzzleComponent } from './password-puzzle.component';

describe('PasswordPuzzleComponent', () => {
  let component: PasswordPuzzleComponent;
  let fixture: ComponentFixture<PasswordPuzzleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordPuzzleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
