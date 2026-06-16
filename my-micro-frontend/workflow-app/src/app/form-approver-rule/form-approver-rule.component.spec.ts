import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormApproverRuleComponent } from './form-approver-rule.component';

describe('FormApproverRuleComponent', () => {
  let component: FormApproverRuleComponent;
  let fixture: ComponentFixture<FormApproverRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormApproverRuleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormApproverRuleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
