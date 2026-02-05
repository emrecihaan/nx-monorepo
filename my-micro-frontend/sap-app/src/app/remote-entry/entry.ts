import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule],
  selector: 'app-sap-app-entry',
  template: `
    <div style="padding: 2rem; border: 1px solid #ddd;">
      <h1>{{ 'SAP_APP.TITLE' | translate }}</h1>
      <p>{{ 'SAP_APP.SUCCESS' | translate }}</p>
    </div>
  `,
})
export class RemoteEntry { }
