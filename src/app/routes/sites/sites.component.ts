import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SitesService } from '../../services/sites.service';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss',
})
export class SitesComponent implements OnInit {
  activeTab: string = 'ViewMySites';
  mySites: any[] = [];
  allSites: any[] = [];
  siteForm: FormGroup;
  isEditing: boolean = false;
  errorMessage: string = ''; // To store error messages

  constructor(
    private sitesService: SitesService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.siteForm = this.fb.group({
      siteId:[''],
      location: ['', [Validators.required, Validators.maxLength(200)]],
      totalArea: ['', [Validators.required, Validators.min(1)]],
      resourceType: ['', [Validators.required, Validators.maxLength(100)]],
      yieldEstimate: ['', [Validators.min(0)]],
      siteStatus: ['Active', Validators.required],
      managerUsername: [this.authService.getUsername(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchMySites();
    this.fetchAllSites();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.errorMessage = ''; // Clear error message when switching tabs
  }

  fetchMySites() {
    const managerUsername = this.authService.getUsername();
    this.sitesService.getSitesByManager(managerUsername!).subscribe({
      next: (data) => (this.mySites = data),
      error: (err) => console.error(err),
    });
  }

  fetchAllSites() {
    this.sitesService.getAllSites().subscribe({
      next: (data) => (this.allSites = data),
      error: (err) => console.error(err),
    });
  }

  saveSite() {
    if (this.isEditing) {
      const updatePayload = this.siteForm.value; // Includes siteId for updates
      console.log('Updating site:', updatePayload);
  
      this.sitesService.updateSite(updatePayload).subscribe({
        next: () => {
          this.fetchAllSites();
          this.fetchMySites();
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.errorMessage = err.error?.title || 'Failed to update site.';
        },
      });
    } else {
      const addPayload = { ...this.siteForm.value };
      delete addPayload.siteId; // Remove siteId for adding
      console.log('Adding new site:', addPayload);
  
      this.sitesService.addSite(addPayload).subscribe({
        next: () => {
          this.fetchAllSites();
          this.fetchMySites();
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.errorMessage = err.error?.title || 'Failed to add site. you have no permissions';
        },
      });
    }
  }
  

  deleteSite(id: number) {
    if (confirm('Are you sure you want to delete this site?')) {
      this.sitesService.deleteSite(id).subscribe({
        next: () => {
          this.fetchAllSites();
          this.fetchMySites();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 403) {
            this.errorMessage = 'You do not have permission to delete this site.';
          } else {
            this.errorMessage = 'An error occurred while trying to delete the site.';
          }
          console.error(err);
        },
      });
    }
  }

  editSite(site: any) {
    this.isEditing = true;
    this.activeTab = 'AddUpdateSites';
    this.siteForm.patchValue(site);
  }

  resetForm() {
    this.isEditing = false;
    this.siteForm.reset();
    this.siteForm.patchValue({
      managerUsername: this.authService.getUsername(),
      siteStatus: 'Active',
    });
  }
  searchLocation: string = '';
searchResults: any[] = [];

searchSitesByLocation() {
  if (!this.searchLocation.trim()) {
    this.errorMessage = 'Please enter a location to search.';
    return;
  }

  this.sitesService.searchByLocation(this.searchLocation).subscribe({
    next: (data) => {
      this.searchResults = data;
      this.errorMessage = '';
    },
    error: (err) => {
      this.errorMessage = err.error || 'No sites found for the specified location.';
    },
  });
}
}
