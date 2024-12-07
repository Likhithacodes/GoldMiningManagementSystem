
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})

export class ReportComponent {
  selectedSiteId: number = 0; 
  generatedReport: any = null; 
  errorMessage: string = ''; 

  constructor(private reportService: ReportService) {}

  // Method to generate reports dynamically based on the type
  generateReport(type: string): void {
    if (!this.selectedSiteId) {
      this.errorMessage = 'Please enter a valid Site ID.';
      return;
    }

    let reportMethod;
    switch (type) {
      case 'production':
        reportMethod = this.reportService.generateProductionReport(this.selectedSiteId);
        break;
      case 'cost':
        reportMethod = this.reportService.generateCostReport(this.selectedSiteId);
        break;
      case 'equipment':
        reportMethod = this.reportService.generateEquipmentReport(this.selectedSiteId);
        break;
      case 'safety':
        reportMethod = this.reportService.generateSafetyReport(this.selectedSiteId);
        break;
      case 'environment':
        reportMethod = this.reportService.generateEnvironmentalReport(this.selectedSiteId);
        break;
    }

    reportMethod?.subscribe({
      next: (data) => {
        this.generatedReport = data;
        this.errorMessage = '';
      },
      error: () => (this.errorMessage = `Failed to generate ${type} report.`),
    });
  }

  // Method to print the generated report
  printReport(): void {
    if (!this.generatedReport) return;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Generated Report', 10, 10); // Title

    let y = 20; // Initial y-axis position
    for (const key of Object.keys(this.generatedReport)) {
      const value = this.generatedReport[key];
      doc.text(`${this.formatKey(key)}: ${value}`, 10, y);
      y += 10; // Increment y position for each line
    }

    doc.save('report.pdf'); // Save the PDF
  }
  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }
}
