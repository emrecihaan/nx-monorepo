import { Route } from '@angular/router';
import { RemoteEntry } from './entry';
import { WorkflowFormComponent } from '../workflow-form/workflow-form.component';
import { BudgetReportUserComponent } from '../budget-report-user/budget-report-user.component';
import { BudgetReportOrganizationComponent } from '../budget-report-organization/budget-report-organization.component';
import { ErpExpenseRequestComponent } from '../erp-expense-request/erp-expense-request.component';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntry },
  { path: 'workflow-form', component: WorkflowFormComponent },
  { path: 'budgetreportuser', component: BudgetReportUserComponent },
  { path: 'budgetreportorganization', component: BudgetReportOrganizationComponent },
  { path: 'expense-request', component: ErpExpenseRequestComponent }
];
