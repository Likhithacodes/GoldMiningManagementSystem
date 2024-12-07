import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeologicalDataService } from '../../services/geological-data.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf'; 
@Component({
  selector: 'app-geological-data',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './geological-data.component.html',
  styleUrl: './geological-data.component.scss'
})





export class GeologicalDataComponent implements OnInit {
  activeTab = 'ViewAllGeologicalData';
  geologicalData: any[] = [];
  siteGeologicalData: any[] = [];
  selectedSiteId!: number | null;
  errorMessage = '';
  isEditing = false;
  geologicalDataForm!: FormGroup;

  constructor(private geologicalDataService: GeologicalDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchAllGeologicalData();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.errorMessage="";
  }

  initForm() {
    this.geologicalDataForm = this.fb.group({
      dataId: [null],
      siteId: ['', [Validators.required]],
      mineralComposition: ['', [Validators.required, Validators.maxLength(200)]],
      sampleCollectedDate: ['', Validators.required],
      surveyReport: ['', Validators.required],
      geologistUsername: ['', Validators.required],
    });
  }

  fetchAllGeologicalData() {
    this.geologicalDataService.getAllGeologicalData().subscribe({
      next: (data) => (this.geologicalData = data),
      error: (err) => (this.errorMessage = "You have no permission to access"),
    });
  }

  fetchGeologicalDataBySite() {
    if (!this.selectedSiteId) {
      this.errorMessage = 'Please enter a valid Site ID.';
      return;
    }
    this.geologicalDataService.getGeologicalDataBySiteId(this.selectedSiteId).subscribe({
      next: (data) => {
        this.siteGeologicalData = data;
        this.errorMessage = '';
      },
      error: (err) => (this.errorMessage = "You have no permission to access"),
    });
  }

  saveGeologicalData() {
    if (this.geologicalDataForm.invalid) {
        this.errorMessage = 'Please fill all required fields.';
        return;
    }

    console.log(this.geologicalDataForm.value); // Log the form data

    const formData = this.geologicalDataForm.value;

    if (this.isEditing) {
        // Include dataId for update
        this.geologicalDataService.updateGeologicalData(formData).subscribe({
            next: () => {
                this.fetchAllGeologicalData();
                this.resetForm();
                alert("saved successfully");
            },
            error: (err) => (this.errorMessage = "You have no permissions to access this."),
        });
    } else {
        // Exclude dataId for add
        const { dataId, ...addData } = formData; // Remove dataId
        this.geologicalDataService.addGeologicalData(addData).subscribe({
            next: () => {
                this.fetchAllGeologicalData();
                this.resetForm();
                alert("saved successfully");
            },
            error: (err) => (this.errorMessage = "You have no permission to access"),
        });
    }
}


resetForm() {
  this.isEditing = false;
  this.geologicalDataForm.reset({
      dataId: null, // Ensure dataId is reset to null
      siteId: '',
      mineralComposition: '',
      sampleCollectedDate: '',
      surveyReport: '',
      geologistUsername: '',
  });
}


  openAddForm() {
    this.activeTab = 'AddGeologicalData';
    this.resetForm();
  }

  editGeologicalData(data: any) {
    this.geologicalDataForm.patchValue(data);
    this.isEditing = true;
    this.activeTab = 'AddGeologicalData';
  }
  generatePDF() {
    const formData = this.geologicalDataForm.value;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text('Geological Data Report', 10, 10);

    pdf.setFontSize(12);
    pdf.text(`Site ID: ${formData.siteId}`, 10, 30);
    pdf.text(`Mineral Composition: ${formData.mineralComposition}`, 10, 40);
    pdf.text(
      `Sample Collected Date: ${new Date(formData.sampleCollectedDate).toLocaleDateString()}`,
      10,
      50
    );
    pdf.text(`Survey Report: ${formData.surveyReport}`, 10, 60);
    pdf.text(`Geologist Username: ${formData.geologistUsername}`, 10, 70);

    pdf.save('Geological_Data_Report.pdf');
  }
  generatePDFForSite(data: any) {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Geological Data Report', 10, 10);

    pdf.setFontSize(12);
    pdf.text(`Data ID: ${data.dataId}`, 10, 30);
    pdf.text(`Site ID: ${data.siteId}`, 10, 40);
    pdf.text(`Mineral Composition: ${data.mineralComposition}`, 10, 50);
    pdf.text(
      `Sample Collected Date: ${new Date(data.sampleCollectedDate).toLocaleDateString()}`,
      10,
      60
    );
    pdf.text(`Survey Report: ${data.surveyReport}`, 10, 70);
    pdf.text(`Geologist Username: ${data.geologistUsername}`, 10, 80);

    pdf.save(`Geological_Data_Report_${data.dataId}.pdf`);
  }
}

