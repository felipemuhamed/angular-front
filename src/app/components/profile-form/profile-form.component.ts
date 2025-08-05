import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../../models/profile.model';
import { KeycloakAuthService } from '../../services/keycloak.service'; // Assuming this service can fetch roles if extended

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;
  isEditMode = false;
  profileId: number | null = null;
  isLoading = false;
  availableKeycloakRoles: string[] = []; // To store roles fetched from Keycloak or a backend API

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private keycloakAuthService: KeycloakAuthService // Inject KeycloakAuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Requisito 8: name not empty
      description: ['', Validators.required],
      status: ['active', Validators.required],
      keycloakRoles: [[]] // Initialize as an empty array for multiselect
    });
  }

  ngOnInit(): void {
    this.profileId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.profileId;

    if (this.isEditMode) {
      this.loadProfile();
    }
    this.loadAvailableKeycloakRoles(); // Load roles regardless of mode
  }

  loadProfile(): void {
    if (this.profileId) {
      this.isLoading = true;
      this.profileService.getProfileById(this.profileId).subscribe({
        next: (profile) => {
          this.profileForm.patchValue(profile);
          // Ensure keycloakRoles is an array if it comes null/undefined
          this.profileForm.get('keycloakRoles')?.setValue(profile.keycloakRoles || []);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          alert(`Failed to load profile: ${error.message || error}`);
          this.isLoading = false;
          this.router.navigate(['/profiles']); // Redirect on error
        }
      });
    }
  }

  // This method would typically fetch roles from a backend API that queries Keycloak
  // Or, if KeycloakAuthService can directly provide application roles.
  // For now, providing a mock or placeholder.
  loadAvailableKeycloakRoles(): void {
    this.isLoading = true;
    // In a real application, this would call a service method
    // For example: `this.keycloakAuthService.getAvailableRoles()` or `this.backendRoleService.getRoles()`
    // For demonstration, use mock roles
    this.availableKeycloakRoles = ['admin', 'user', 'manager', 'editor', 'viewer'];
    this.isLoading = false;
    // If fetching from API:
    // this.keycloakAuthService.getAvailableRoles().subscribe({
    //   next: (roles) => {
    //     this.availableKeycloakRoles = roles;
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading Keycloak roles:', error);
    //     alert(`Failed to load Keycloak roles: ${error.message || error}`);
    //     this.isLoading = false;
    //   }
    // });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      alert('Please correct the form errors.');
      // Requisito 8: show validation messages
      this.profileForm.markAllAsTouched(); // Mark all fields as touched to display errors
      return;
    }

    this.isLoading = true;
    const profileData: Profile = this.profileForm.value;

    // Requisito 8: Validate uniqueness of name (usually done on backend, but client-side check if possible)
    // For client-side, would require fetching all profiles or a specific endpoint
    // Assuming backend handles uniqueness validation and returns appropriate error.

    if (this.isEditMode && this.profileId) {
      this.profileService.updateProfile(this.profileId, profileData).subscribe({
        next: () => {
          alert('Profile updated successfully!'); // Requisito 7
          this.isLoading = false;
          this.router.navigate(['/profiles']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert(`Failed to update profile: ${error.message || error}`); // Requisito 7
          this.isLoading = false;
        }
      });
    } else {
      this.profileService.createProfile(profileData).subscribe({
        next: () => {
          alert('Profile created successfully!'); // Requisito 7
          this.isLoading = false;
          this.router.navigate(['/profiles']);
        },
        error: (error) => {
          console.error('Error creating profile:', error);
          alert(`Failed to create profile: ${error.message || error}`); // Requisito 7
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/profiles']);
  }
}