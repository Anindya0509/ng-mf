import { Component, CUSTOM_ELEMENTS_SCHEMA, effect } from '@angular/core';
import { Member, DataService, IssueButtonRendererComponent } from '@ng-mf/shared';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'ng-mf-member-details',
  imports: [AgGridModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './memberDetails.component.html',
  styleUrl: './memberDetails.component.css',
})
export class MemberDetailsComponent {
  columnDefs: any[];
  rowData: Member[] = [];
  frameworkComponents: any;

  constructor(private ds: DataService) {
    this.columnDefs = [
      { field: 'name', headerName: 'Member Name' },
      { field: 'age', headerName: 'Age' },
      { field: 'contactNumber', headerName: 'Contact Number' },
      { field: 'issuedBookId', headerName: 'Issued Book ID' },
      {
        headerName: 'Actions',
        cellRenderer: IssueButtonRendererComponent,
        cellRendererParams: {
          mode: 'memberDetails',
          label: 'Issue Book'
        },
      }
    ];

    effect(() => {
      this.rowData = this.ds.getMembers()();
    });
  }

}
