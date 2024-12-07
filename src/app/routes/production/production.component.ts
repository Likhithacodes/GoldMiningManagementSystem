import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../../services/production.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Legend,
  Title,
} from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
})
export class ProductionComponent implements OnInit {
  productions: any[] = [];
  productionForm: FormGroup;
  isEditing = false;
  showForm = false;
  errorMessage = '';
  dailyProduction: any = {};
  weeklyProduction: any = {};
  monthlyProduction: any = {};

  selectedSiteId!: number | null;
  activeTab = 'All Productions'; 
  yieldEfficiencies: any[] = [];
  private yieldChart!: Chart;

  constructor(
    private productionService: ProductionService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.productionForm = this.fb.group({
      siteId: ['', [Validators.required]],
      oreExtracted: ['', [Validators.required, Validators.min(0)]],
      goldProduced: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      shiftSupervisorUsername: [this.authService.getUsername(), Validators.required],
    });
  }

  ngOnInit(): void {
    Chart.register(CategoryScale, LinearScale, BarElement, BarController, Legend, Title);
    this.fetchProductions();
    this.fetchYieldEfficiencyForAllSites();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  validateSiteId(): boolean {
    if (!this.selectedSiteId || this.selectedSiteId <= 0) {
      this.errorMessage = 'Please enter a valid Site ID.';
      console.log(this.selectedSiteId);
      return false;
    }
    this.errorMessage = ''; // Clear error message
    console.log(this.selectedSiteId);
    return true;
  }

  fetchProductions() {
    this.productionService.getAll().subscribe({
      next: (data) => (this.productions = Array.isArray(data) ? data : []),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  fetchYieldEfficiencyForAllSites() {
    this.productionService.getYieldEfficiencyForAllSites().subscribe({
      next: (data) => {
        const transformedData = Object.keys(data).map((siteId) => ({
          siteId: parseInt(siteId, 10),
          efficiency: data[siteId],
        }));
        this.yieldEfficiencies = transformedData;
        this.renderYieldEfficiencyChart(transformedData);
      },
      error: (err) => console.error('Error fetching yield efficiency:', err),
    });
  }

  fetchSiteData() {
    if (!this.validateSiteId()) return;
    this.fetchDailyProduction();
    this.fetchWeeklyProduction();
    this.fetchMonthlyProduction();
  }

  fetchDailyProduction() {
    this.productionService.getDailyProduction(this.selectedSiteId!).subscribe({
      next: (data) => {
        this.dailyProduction = Object.entries(data || {}).map(([key, value]) => ({
          key: new Date(key), // Convert key to Date
          value,
        }));
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to fetch daily production.';
      },
    });
  }
  

  fetchWeeklyProduction() {
    if (!this.selectedSiteId || this.selectedSiteId <= 0) {
      this.errorMessage = 'Please enter a valid Site ID.';
      console.log('Invalid Site ID:', this.selectedSiteId); // Log invalid Site ID
      return;
    }
  
    console.log('Fetching Weekly Production for Site ID:', this.selectedSiteId); // Log the Site ID being used
    this.productionService.getWeeklyProduction(this.selectedSiteId!).subscribe({
      next: (data) => {
        console.log('Weekly Production Data:', data); 
        this.weeklyProduction = data || {};
        console.log(this.weeklyProduction);
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error Fetching Weekly Production:', err); // Log the error details
        this.errorMessage = err.message || 'Failed to fetch weekly production.';
      },
    });
  }
  
  fetchMonthlyProduction() {
    this.productionService.getMonthlyProduction(this.selectedSiteId!).subscribe({
      next: (data) => (this.monthlyProduction = data || {}),
      error: (err) => {
        this.errorMessage = err.message || 'Failed to fetch monthly production.';
      },
    });
  }

  saveProduction() {
    const payload = this.productionForm.value;
    if (!payload.siteId || !payload.oreExtracted || !payload.goldProduced || !payload.date) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
    if (this.isEditing) {
      this.productionService.updateProduction(payload.productionId, payload).subscribe({
        next: () => {
          this.fetchProductions();
          this.resetForm();
        },
        error: (err) => (this.errorMessage = err.message),
      });
    } else {
      this.productionService.addProduction(payload).subscribe({
        next: () => {
          this.fetchProductions();
          this.resetForm();
        },
        error: (err) => (this.errorMessage = err.message),
      });
    }
  }

  renderYieldEfficiencyChart(data: any[]) {
    const chartData = {
      labels: data.map((item) => `Site ${item.siteId}`),
      datasets: [
        {
          label: 'Yield Efficiency (%)',
          data: data.map((item) => item.efficiency),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    if (this.yieldChart) {
      this.yieldChart.destroy();
    }

    this.yieldChart = new Chart('yieldEfficiencyChart', {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  resetForm() {
    this.isEditing = false;
    this.showForm = false;
    this.productionForm.reset();
    this.productionForm.patchValue({
      shiftSupervisorUsername: this.authService.getUsername(),
    });
  }

  openFormForAdd() {
    this.activeTab = 'Form'; // Ensure activeTab is set to 'showForm'
    this.showForm = true;        // Ensure the form visibility flag is true
    this.isEditing = false;      // Indicate this is an "Add" action
    this.resetForm();            // Reset the form fields
  }
  
}
