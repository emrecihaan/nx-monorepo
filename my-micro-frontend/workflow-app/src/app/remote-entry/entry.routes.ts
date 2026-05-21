import { Route } from '@angular/router';
import { RemoteEntry } from './entry';
import { WorkflowFormComponent } from '../workflow-form/workflow-form.component';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntry },
  { path: 'workflow-form', component: WorkflowFormComponent }
];
