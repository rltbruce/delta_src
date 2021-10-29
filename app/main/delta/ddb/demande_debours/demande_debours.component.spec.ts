import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Demande_deboursComponent } from './demande_debours.component';

describe('DemandeDeboursComponent', () => {
  let component: Demande_deboursComponent;
  let fixture: ComponentFixture<Demande_deboursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Demande_deboursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Demande_deboursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
