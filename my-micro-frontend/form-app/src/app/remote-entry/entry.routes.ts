import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { ReportComponent } from '../report/report.component';
import { CostRuleComponent } from '../cost-rule/cost-rule.component';
import { CostRuleFilterComponent } from '../cost-rule-filter/cost-rule-filter.component';
import { ParameterTypeComponent } from '../parameter-type/parameter-type.component';
import { ExpenseTypeComponent } from '../expense-type/expense-type.component';
import { UserProxyComponent } from '../user-proxy/user-proxy.component';
import { ExpenseGroupComponent } from '../expense-group/expense-group.component';
import { ExpenseCenterComponent } from '../expense-center/expense-center.component';
import { ReportDetailComponent } from '../report-detail/report-detail.component';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntry },
  { path: 'report-detail', component: ReportDetailComponent },
  { path: 'dynamic-form/:dfformid', component: DynamicFormComponent },
  { path: 'dynamic-form/:dfformid/:trformid', component: DynamicFormComponent },
  { path: 'report', component: ReportComponent },
  { path: 'expense-reports', component: ReportComponent },
  { path: 'cost-rule', component: CostRuleComponent },
  { path: 'cost-rule-filter/:id', component: CostRuleFilterComponent },
  { path: 'parameter-type', component: ParameterTypeComponent },
  { path: 'expense-type', component: ExpenseTypeComponent },
  { path: 'user-proxy', component: UserProxyComponent },
  { path: 'expense-group', component: ExpenseGroupComponent },
  { path: 'expense-center', component: ExpenseCenterComponent },
];
