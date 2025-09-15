import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { IssueSelectorDialogComponent, IssueDialogData } from './issue-selector-dialog.component';
import { Book, Member, DataService } from '@ng-mf/shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'issue-button-renderer',
  standalone: true, 
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <button class="button" *ngIf="!isIssued" (click)="onIssueClick()">{{ issueLabel || 'Issue' }}</button>
    <button class="button" *ngIf="isIssued" (click)="onUnissueClick()">{{ unissueLabel || 'Unissue' }}</button>
  `,
  styles: [
    `
    .button {
      cursor: pointer;
      padding: 4px 8px; /* Adjust padding as needed */
      border: none;
      background-color:rgb(64, 79, 95); /* Primary color for button */
      color: white;
      border-radius: 5px;
      font-size: 14px;
      transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
    }

    .button:hover {
      background-color:rgb(116, 219, 247); /* Light gray on hover */
      transform: scale(1.02); /* Slightly enlarge on hover */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow on hover */
    }
  `
]
})
export class IssueButtonRendererComponent implements ICellRendererAngularComp {
  params: any;
  issueLabel: string = '';
  unissueLabel: string = '';
  mode: 'bookDetails' | 'memberDetails' = 'bookDetails';
  itemData: Book | Member | null = null;
  isIssued: boolean = false;

  constructor(private dialog: MatDialog, private ds: DataService) {}

  agInit(params: any): void {
    this.params = params;
    this.issueLabel = params.issueLabel || 'Issue';
    this.unissueLabel = params.unissueLabel || 'Unissue';
    this.mode = params.mode;
    this.itemData = params.data;

    // Determine issued state depending on mode and data
    if (this.mode === 'bookDetails') {
      this.isIssued = (this.itemData as Book).issued || false;
    } else if (this.mode === 'memberDetails') {
      this.isIssued = !!(this.itemData as Member).issuedBookId;
    }
  }

  refresh(params: any): boolean {
    return false;
  }

  onIssueClick() {
    const dialogRef = this.dialog.open(IssueSelectorDialogComponent, {
      width: '300px',
      data: {
        mode: this.mode,
        itemId: this.itemData?.id
      } as IssueDialogData
    });
  
    dialogRef.afterClosed().subscribe((choice) => {
      if (choice) {
        if (this.mode === 'bookDetails') {
          this.ds.issueBook((this.itemData as Book).id, (choice as Member).id)
            .subscribe(); // just subscribe, no manual refresh needed
        } else {
          this.ds.issueBook((choice as Book).id, (this.itemData as Member).id)
            .subscribe(); // just subscribe, no manual refresh needed
        }
      }
    });
  }
  

  onUnissueClick() {
    if (this.mode === 'bookDetails' && this.itemData) {
      this.ds.unissueBook((this.itemData as Book).id)
        .subscribe(); // no manual refresh needed
    } else if (this.mode === 'memberDetails' && this.itemData) {
      const member = this.itemData as Member;
      if (member.issuedBookId) {
        this.ds.unissueBook(member.issuedBookId)
          .subscribe(); // no manual refresh needed
      }
    }
  }
  
}
