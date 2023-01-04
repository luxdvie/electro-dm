import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignToolsComponent } from './campaign-tools.component';

describe('CampaignToolsComponent', () => {
  let component: CampaignToolsComponent;
  let fixture: ComponentFixture<CampaignToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
