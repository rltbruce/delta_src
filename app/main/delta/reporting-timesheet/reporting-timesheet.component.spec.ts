import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingTimesheetComponent } from './reporting-timesheet.component';

describe('ReportingTimesheetComponent', () => {
  let component: ReportingTimesheetComponent;
  let fixture: ComponentFixture<ReportingTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
