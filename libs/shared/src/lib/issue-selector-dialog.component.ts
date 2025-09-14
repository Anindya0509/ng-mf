import { Component, computed, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Book, Member, DataService } from '@ng-mf/shared';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

export interface IssueDialogData {
  mode: 'bookDetails' | 'memberDetails';
  itemId: string;
}

@Component({
  selector: 'shared-issue-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      Select {{ mode === 'bookDetails' ? 'Member' : 'Book' }}
    </h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item 
          *ngFor="let choice of filteredChoices()" 
          (click)="select(choice)"
          class="choice-item"
          tabindex="0"
          role="button"
          (keydown.enter)="select(choice)"
          (keydown.space)="select(choice)"
        >
          {{ display(choice) }}
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="cancel()">Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [/* your styles here */]
})
export class IssueSelectorDialogComponent {
  private dialogRef = inject(MatDialogRef<IssueSelectorDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as IssueDialogData;
  private ds = inject(DataService);

  mode = this.data.mode;

  // Use signals directly if DataService returns signals
  private membersSignal = this.ds.getMembers();
  private booksSignal = this.ds.getBooks();

  filteredChoices = computed<(Member | Book)[]>(() => {
    if (this.mode === 'bookDetails') {
      const members = this.membersSignal() ?? [];
      return members.filter(m => !m.issuedBookId);
    } else {
      const books = this.booksSignal() ?? [];
      return books.filter(b => !b.issued);
    }
  });

  display(item: any): string {
    if (this.mode === 'bookDetails') {
      const member = item as Member;
      return `${member.name} (ID: ${member.id})`;
    } else {
      const book = item as Book;
      return `${book.name} by ${book.author}`;
    }
  }

  select(choice: any) {
    this.dialogRef.close(choice);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
