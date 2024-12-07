import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CostManagementService } from '../../services/cost-management.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cost-management',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cost-management.component.html',
  styleUrl: './cost-management.component.scss',
})
export class CostManagementComponent implements OnInit {
  costForm: FormGroup;
  costs: any[] = [];
  totalExpenses: number = 0;
  expenseBreakdown: any = {};
  budgetValidationMessage: string = '';
  selectedSiteId: number | null = null;
  isEditing: boolean = false;
  activeTab: string = 'viewAll';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private costService: CostManagementService) {
    this.costForm = this.fb.group({
      costId: [null],
      siteId: ['', Validators.required],
      expenseType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      responsiblePersonUserName: ['', Validators.required],
      budget: [''],
      selectedSiteId: [''], // Add this form control for Site ID
    });
    
  }

  ngOnInit(): void {
    this.fetchAllCosts();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    if (tab === 'viewAll') this.fetchAllCosts();
  }

  fetchAllCosts(): void {
    this.costService.getAllCosts().subscribe({
      next: (data) => (this.costs = data),
      error: () => (this.errorMessage = 'Failed to load costs.'),
    });
  }

  fetchCostsBySiteId(): void {
    if (!this.selectedSiteId) {
      this.errorMessage = 'Please enter a valid Site ID.';
      return;
    }

    this.costService.getCostsBySiteId(this.selectedSiteId).subscribe({
      next: (data) => (this.costs = data),
      error: () => (this.errorMessage = 'Failed to load costs for the specified Site ID.'),
    });
  }

  getTotalExpensesBySiteId(): void {
    if (!this.selectedSiteId) {
      this.errorMessage = 'Please enter a valid Site ID.';
      return;
    }

    this.costService.getTotalExpensesBySiteId(this.selectedSiteId).subscribe({
      next: (total) => (this.totalExpenses = total),
      error: () => (this.errorMessage = 'Failed to retrieve total expenses.'),
    });
  }

  getExpenseBreakdownBySiteId(): void {
    if (!this.selectedSiteId) {
      this.errorMessage = 'Please enter a valid Site ID.';
      return;
    }

    this.costService.getExpenseBreakdownBySiteId(this.selectedSiteId).subscribe({
      next: (breakdown) => (this.expenseBreakdown = breakdown),
      error: () => (this.errorMessage = 'Failed to retrieve expense breakdown.'),
    });
  }

  addOrUpdateCost(): void {
    if (this.costForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const formData = this.costForm.value;

    if (this.isEditing) {
      this.costService.updateCost(formData.costId, formData).subscribe({
        next: () => {
          alert('Cost updated successfully!');
          this.resetForm();
          this.fetchAllCosts();
        },
        error: () => (this.errorMessage = 'Failed to update cost.'),
      });
    } else {
      this.costService.addCost(formData).subscribe({
        next: () => {
          alert('Cost added successfully!');
          this.resetForm();
          this.fetchAllCosts();
        },
        error: () => (this.errorMessage = 'Failed to add cost.'),
      });
    }
  }
  validateBudget(): void {
    const siteId = this.costForm.get('selectedSiteId')?.value;
    const budget = this.costForm.get('budget')?.value;
  
    if (!siteId || !budget) {
      this.errorMessage = 'Please enter Site ID and Budget for validation.';
      return;
    }
  
    this.errorMessage = '';
    this.budgetValidationMessage = '';
  
    // Make sure to send the body as JSON
    const body = { budget: parseFloat(budget) };
  
    this.costService.validateBudget(siteId, body).subscribe({
      next: (response) => {
        this.budgetValidationMessage = response.message;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Budget validation failed.';
        this.budgetValidationMessage = '';
      },
    });
  }
  

  editCost(cost: any): void {
    this.costForm.patchValue(cost);
    this.isEditing = true;
    this.errorMessage = '';
    this.setActiveTab('addUpdate');
  }

  resetForm(): void {
    this.costForm.reset();
    this.isEditing = false;
    this.errorMessage = '';
  }
}
