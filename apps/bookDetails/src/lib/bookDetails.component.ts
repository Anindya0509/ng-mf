import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, OnInit } from '@angular/core';
import { Book, DataService, IssueButtonRendererComponent } from '@ng-mf/shared';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'ng-mf-book-details',
  standalone: true, 
  imports: [AgGridModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bookDetails.component.html',
  styleUrls: ['./bookDetails.component.css'],
})
export class BookDetailsComponent {
  columnDefs: any[];
  rowData: Book[] = [];
  frameworkComponents: any;

  constructor(private ds: DataService) {
    this.columnDefs = [
      { field: 'name', headerName: 'Book Name' },
      { field: 'author', headerName: 'Author' },
      { field: 'issued', headerName: 'Issued Status' },
      { field: 'issuedToMemberId', headerName: 'Issued To' },
      {
        headerName: 'Actions',
        cellRenderer: IssueButtonRendererComponent,
        cellRendererParams: {
          mode: 'bookDetails',
          label: 'Issue Book'
        }
      }
    ];
    effect(() => {
      this.rowData = this.ds.getBooks()();
    });
  }
}
