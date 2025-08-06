import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CallRecord, CallRecordApiResponse } from '../../models/call-record.model';
import { CallRecordService } from '../../services/call-record.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-call-record-list',
  templateUrl: './call-record-list.component.html',
  styleUrls: ['./call-record-list.component.css']
})
export class CallRecordListComponent implements OnInit, OnDestroy {
  callRecords: CallRecord[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private callRecordService: CallRecordService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCallRecords();

    this.subscriptions.add(this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1; // Reset to first page on new search
      this.loadCallRecords();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCallRecords(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.subscriptions.add(this.callRecordService.getCallRecords(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (data: CallRecordApiResponse) => {
          this.callRecords = data.callRecords;
          this.totalRecords = data.totalCount;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load call records: ' + err.message;
          this.isLoading = false;
          console.error('Error loading call records:', err);
        }
      })
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator is 0-indexed, API is 1-indexed
    this.pageSize = event.pageSize;
    this.loadCallRecords();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  addCallRecord(): void {
    this.router.navigate(['/call-records/add']);
  }

  editCallRecord(id: number | undefined): void {
    if (id) {
      this.router.navigate([`/call-records/edit/${id}`]);
    }
  }

  deleteCallRecord(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this call record?')) {
      this.isLoading = true;
      this.subscriptions.add(this.callRecordService.deleteCallRecord(id)
        .subscribe({
          next: () => {
            this.showSuccessMessage('Call record deleted successfully!');
            this.loadCallRecords(); // Refresh the list
          },
          error: (err) => {
            this.errorMessage = 'Failed to delete call record: ' + err.message;
            this.isLoading = false;
            console.error('Error deleting call record:', err);
          }
        })
      );
    }
  }

  private showSuccessMessage(message: string): void {
    // Implement a toast/snackbar service for success messages
    console.log(message);
    // Example: this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showErrorMessage(message: string): void {
    // Implement a toast/snackbar service for error messages
    console.error(message);
    // Example: this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}