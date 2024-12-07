import { Component, OnInit } from '@angular/core';
import { SafetyIncidentService } from '../../services/safety-incident.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-safety-incident',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './safety-incident.component.html',
  styleUrl: './safety-incident.component.scss'
})

export class SafetyIncidentComponent implements OnInit {
  activeTab: string = 'viewAll';
  safetyIncidents: any[] = [];
  selectedIncident: any = null;
  incidentsBySite: any[] = [];
  incidentForm!: FormGroup;
  errorMessage: string = '';
  isEditing: boolean = false;

  // Filters
  selectedSiteId!: number | null;
  selectedIncidentId!: number | null;

  constructor(
    private incidentService: SafetyIncidentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchAllIncidents();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.selectedIncident = null;
  }

  initForm(): void {
    this.incidentForm = this.fb.group({
      incidentId: [null],
      siteId: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['', Validators.required],
      resolutionStatus: ['', Validators.required],
      reportedByUserName: ['', Validators.required],
    });
  }

  // Fetch all incidents
  fetchAllIncidents(): void {
    this.incidentService.getAllIncidents().subscribe({
      next: (data) => (this.safetyIncidents = data),
      error: () => (this.errorMessage = 'Failed to load incidents'),
    });
  }

  // Fetch incidents by site
  fetchIncidentsBySite(): void {
    if (!this.selectedSiteId) return;

    this.incidentService.getIncidentsBySiteId(this.selectedSiteId).subscribe({
      next: (data) => (this.incidentsBySite = data),
      error: () => (this.errorMessage = 'Failed to fetch incidents by site'),
    });
  }

  // Fetch a single incident by ID
  fetchIncidentById(): void {
    if (!this.selectedIncidentId) return;

    this.incidentService.getIncidentById(this.selectedIncidentId).subscribe({
      next: (data) => (this.selectedIncident = data),
      error: () => (this.errorMessage = 'Incident not found'),
    });
  }

  // Save or update an incident
  saveIncident(): void {
    if (this.incidentForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      console.error('Invalid Form Data:', this.incidentForm.value);
      return;
    }
  
    const formData = this.incidentForm.value;
  
    // Convert date to ISO format
    formData.date = new Date(formData.date).toISOString();
  
    console.log('Payload being sent to server:', formData);
    if (!this.isEditing) {
      delete formData.incidentId;
    }
    if (this.isEditing) {
      this.incidentService.updateIncident(formData.incidentId, formData).subscribe({
        next: () => {
          this.fetchAllIncidents();
          this.setActiveTab('viewAll');
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update incident';
          console.error('Update Error:', err);
        },
      });
    } else {
      this.incidentService.addIncident(formData).subscribe({
        next: () => {
          this.fetchAllIncidents();
          this.setActiveTab('viewAll');
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to add incident';
          console.error('Add Error:', err);
        },
      });
    }
  }
  
  

  // Edit incident
  editIncident(incident: any): void {
    this.incidentForm.patchValue(incident);
    this.isEditing = true;
    this.setActiveTab('addUpdate');
  }

  // Reset form
  resetForm(): void {
    this.isEditing = false;
    this.incidentForm.reset();
  }
}
