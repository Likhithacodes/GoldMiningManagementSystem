import { Component, OnInit } from '@angular/core';
import { EnvironmentalDataService } from '../../services/environmental-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-environmental-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './environmental-data.component.html',
  styleUrl: './environmental-data.component.scss',
})
export class EnvironmentalDataComponent implements OnInit {
  environmentalDataList: any[] = [];
  siteId: number = 0;
  activeTab: string = 'fetchBySiteId'; // Track active tab
  errorMessage: string = '';
  showForm: boolean = false;
  isEditing: boolean = false;
  dataForm: FormGroup;

  constructor(
    private environmentalDataService: EnvironmentalDataService,
    private fb: FormBuilder
  ) {
    this.dataForm = this.fb.group({
      assessmentId: [null],
      siteId: ['', Validators.required],
      impactType: ['', Validators.required],
      date: ['', Validators.required],
      recommendations: [''],
      conductedByUsername: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.showForm = tab === 'add';

    if (tab === 'showAll') {
      this.fetchAllEnvironmentalData();
    } else {
      this.environmentalDataList = [];
    }

    if (tab !== 'add') {
      this.dataForm.reset();
      this.isEditing = false;
      this.showForm = false;
    }
  }

  fetchAllEnvironmentalData(): void {
    this.environmentalDataService.getAllEnvironmentalData().subscribe({
      next: (data) => (this.environmentalDataList = data),
      error: () => (this.errorMessage = 'Failed to fetch environmental data.'),
    });
  }

  fetchBySiteId(): void {
    if (!this.siteId) {
      this.errorMessage = 'Please enter a valid Site ID.';
      return;
    }
    this.environmentalDataService.getEnvironmentalDataBySiteId(this.siteId).subscribe({
      next: (data) => (this.environmentalDataList = data),
      error: () => (this.errorMessage = 'No data found for this Site ID.'),
    });
  }

  addEnvironmentalData(): void {
    if (this.dataForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    const formData = { ...this.dataForm.value };

    if (!this.isEditing) {
      delete formData.assessmentId;
    }

    if (this.isEditing) {
      this.environmentalDataService
        .updateEnvironmentalData(formData.assessmentId, formData)
        .subscribe({
          next: () => {
            this.resetFormAndFetchData();
            this.isEditing = false;
            this.errorMessage = '';
          },
          error: () => (this.errorMessage = 'Failed to update environmental data.'),
        });
    } else {
      this.environmentalDataService.addEnvironmentalData(formData).subscribe({
        next: () => {
          this.resetFormAndFetchData();
          this.errorMessage = '';
        },
        error: () => (this.errorMessage = 'Failed to add environmental data.'),
      });
    }
  }

  editEnvironmentalData(data: any): void {
    this.showForm = true;
    this.isEditing = true;
    this.dataForm.patchValue(data);
    this.activeTab = 'add';
  }

  deleteEnvironmentalData(id: number): void {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.environmentalDataService.deleteEnvironmentalData(id).subscribe({
        next: () => this.fetchAllEnvironmentalData(),
        error: () => (this.errorMessage = 'Failed to delete environmental data.'),
      });
    }
  }

  resetFormAndFetchData(): void {
    this.showForm = false;
    this.dataForm.reset();
    this.isEditing = false;
    this.fetchAllEnvironmentalData();
  }

  toggleAddForm(): void {
    this.showForm = !this.showForm;
    this.isEditing = false;
    this.dataForm.reset();
  }
}
