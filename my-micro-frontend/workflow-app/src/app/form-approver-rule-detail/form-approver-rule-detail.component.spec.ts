import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormApproverRuleDetailComponent } from './form-approver-rule-detail.component';

describe('FormApproverRuleDetailComponent', () => {
  let component: FormApproverRuleDetailComponent;
  let fixture: ComponentFixture<FormApproverRuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormApproverRuleDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormApproverRuleDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
