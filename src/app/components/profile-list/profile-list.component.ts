import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  profiles: Profile[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'status', 'actions'];
  isLoading = false;
  totalProfiles = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfiles();

    this.searchSubject.pipe(
      debounceTime(300), // wait for 300ms after each keystroke before considering the term
      distinctUntilChanged() // ignore if next search term is same as current search term
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1; // Reset to first page on new search
      this.loadProfiles();
    });
  }

  loadProfiles(): void {
    this.isLoading = true;
    this.profileService.getProfiles(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (data) => {
        this.profiles = data.profiles;
        this.totalProfiles = data.totalCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profiles:', error);
        alert(`Failed to load profiles: ${error.message || error}`);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator pageIndex is 0-based
    this.pageSize = event.pageSize;
    this.loadProfiles();
  }

  addProfile(): void {
    this.router.navigate(['/profiles/add']);
  }

  editProfile(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/profiles/edit', id]);
    }
  }

  deleteProfile(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      this.isLoading = true;
      this.profileService.deleteProfile(id).subscribe({
        next: () => {
          alert('Profile deleted successfully!');
          this.loadProfiles(); // Reload list after deletion
        },
        error: (error) => {
          console.error('Error deleting profile:', error);
          alert(`Failed to delete profile: ${error.message || error}`);
          this.isLoading = false;
        }
      });
    }
  }
}