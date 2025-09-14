import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';
import { BookDetailsComponent } from '../../lib/bookDetails.component';

@Component({
  imports: [NxWelcome, BookDetailsComponent],
  selector: 'ng-mf-bookDetails-entry',
  template: `
    <ng-mf-nx-welcome></ng-mf-nx-welcome>  
    <ng-mf-book-details></ng-mf-book-details>
    `,
})
export class RemoteEntry {}
