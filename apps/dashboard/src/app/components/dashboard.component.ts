import { Component, OnDestroy, OnInit } from '@angular/core';
import { Issue, DataService } from '@ng-mf/shared';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'ng-mf-dashboard',
  imports: [AgGridModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  columnDefs = [
    { field: 'bookName', headerName: 'Book' },
    { field: 'memberName', headerName: 'Member' },
    { field: 'issueTime', headerName: 'Time Issued' }
  ] as ColDef<Issue>[];

  rowData: Issue[] = [];

  constructor(private ds: DataService) {}

  ngOnInit() {
    // Initialize signals here if not already initialized
    this.ds.booksSignal.set(this.ds.loadBooksFromLocalStorage());
    this.ds.membersSignal.set(this.ds.loadMembersFromLocalStorage());
    this.rowData = this.ds.getIssues()();
  }
}
