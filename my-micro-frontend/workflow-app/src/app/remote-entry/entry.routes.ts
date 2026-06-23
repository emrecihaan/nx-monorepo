import { Route } from '@angular/router';
import { RemoteEntry } from './entry';
import { WorkflowFormComponent } from '../workflow-form/workflow-form.component';
import { BudgetReportUserComponent } from '../budget-report-user/budget-report-user.component';
import { BudgetReportOrganizationComponent } from '../budget-report-organization/budget-report-organization.component';
import { ErpExpenseRequestComponent } from '../erp-expense-request/erp-expense-request.component';
import { BudgetRuleComponent } from '../budget-rule/budget-rule.component';

import { FormApproverRuleComponent } from '../form-approver-rule/form-approver-rule.component';
import { FormApproverRuleDetailComponent } from '../form-approver-rule-detail/form-approver-rule-detail.component';

import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { OrganizationComponent } from '../organization/organization.component';


export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntry },
  { path: 'workflow-form', component: WorkflowFormComponent },
  { path: 'budgetreportuser', component: BudgetReportUserComponent },
  { path: 'budgetreportorganization', component: BudgetReportOrganizationComponent },
  { path: 'expense-request', component: ErpExpenseRequestComponent },
  { path: 'budgetrule', component: BudgetRuleComponent },
  { path: 'form-approver-rule', component: FormApproverRuleComponent },
  { path: 'formapproverruledetail/:dfFormId', component: FormApproverRuleDetailComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'organization', component: OrganizationComponent }

];
