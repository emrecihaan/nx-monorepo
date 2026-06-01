import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-formApp-entry',
  template: `<router-outlet></router-outlet>`,
})
export class RemoteEntry {}
