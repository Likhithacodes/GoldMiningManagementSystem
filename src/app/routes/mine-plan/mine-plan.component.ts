import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MinePlanService } from '../../services/mine-plan.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mine-plan',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './mine-plan.component.html',
  styleUrl: './mine-plan.component.scss',
})
export class MinePlanComponent implements OnInit {
  activeTab: string = 'viewAll';
  minePlans: any[] = [];
  minePlansBySite: any[] = [];
  selectedSiteId: number | null = null;
  minePlanForm!: FormGroup;
  isEditing = false;
  errorMessage: string = '';

  constructor(private minePlanService: MinePlanService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchAllMinePlans();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.fetchAllMinePlans();
  }

  initForm(): void {
    this.minePlanForm = this.fb.group({
      planId: [null],
      siteId: ['', Validators.required],
      activityType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      assignedEngineerUsername: ['', Validators.required],
    });
  }

  fetchAllMinePlans(): void {
    this.minePlanService.getAllMinePlans().subscribe({
      next: (data) => {
        this.minePlans = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load mine plans';
      },
    });
  }

  fetchMinePlansBySite(): void {
    if (!this.selectedSiteId) return;

    this.minePlanService.getMinePlansBySiteId(this.selectedSiteId).subscribe({
      next: (data) => {
        this.minePlansBySite = data;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch plans by site ID';
      },
    });
  }

  validateAndSaveMinePlan(): void {
    if (this.minePlanForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    const formData = { ...this.minePlanForm.value };
    if (!this.isEditing) delete formData.planId;

    this.minePlanService.validateSchedule(formData).subscribe({
      next: (response) => {
        
        if (this.isEditing) {
          this.minePlanService.updateMinePlan(formData.planId, formData).subscribe({
            next: () => this.onSuccess('Mine plan updated successfully.'),
            error: () => (this.errorMessage = 'Failed to update mine plan.'),
          });
        } else {
          this.minePlanService.addMinePlan(formData).subscribe({
            next: () => this.onSuccess('Mine plan added successfully.'),
            error: () => (this.errorMessage = 'Failed to add mine plan.'),
          });
        }
      },
      error: () => {
        this.errorMessage = 'Scheduling constraints not met.An Incident has occured in this site and the status is not resolved so mine planning cannot be done';
      },
    });
  }

  editPlan(plan: any): void {
    this.minePlanForm.patchValue(plan);
    this.isEditing = true;
    this.setActiveTab('addUpdate');
  }

  deleteMinePlan(planId: number): void {
    this.minePlanService.deleteMinePlan(planId).subscribe({
      next: () => this.fetchAllMinePlans(),
      error: () => (this.errorMessage = 'Failed to delete mine plan.'),
    });
  }

  onSuccess(message: string): void {
    alert(message);
    this.fetchAllMinePlans();
    this.setActiveTab('viewAll');
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing = false;
    this.minePlanForm.reset();
  }
}
