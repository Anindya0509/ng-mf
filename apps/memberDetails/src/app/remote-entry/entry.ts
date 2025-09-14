import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';
import { MemberDetailsComponent } from '../../lib/memberDetails.component';

@Component({
  imports: [NxWelcome, MemberDetailsComponent],
  selector: 'ng-mf-memberDetails-entry',
  template: `
  <ng-mf-nx-welcome></ng-mf-nx-welcome>
  <ng-mf-member-details></ng-mf-member-details>
  `,  
})
export class RemoteEntry {}
