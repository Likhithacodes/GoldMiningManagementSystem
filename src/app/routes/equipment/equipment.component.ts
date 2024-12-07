import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipmentService } from '../../services/equipment.service';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-equipment',
  standalone:true,
  imports:[ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent implements OnInit {
  activeTab = 'viewAll';
  equipmentList: any[] = [];
  equipmentBySite: any[] = [];
  equipmentByType: any[] = [];
  selectedSiteId!: number | null;
  selectedType!: string;
  isEditing = false;
  errorMessage = '';
  equipmentForm!: FormGroup;
  equipmentIdToAssign!: number | null; // For assigning equipment
  siteIdToAssign!: number | null;
  assignmentMessage: string = ''; 

  constructor(private equipmentService: EquipmentService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchAllEquipment();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = ''; 
    this.assignmentMessage='';
  }
  
  // Initialize form
  initForm() {
    this.equipmentForm = this.fb.group({
      equipmentId:[null],
      nameOfEquipment: ['', Validators.required],
      typeOfEquipment: ['', Validators.required],
      condition: ['', Validators.required],
      maintenanceDate: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]],
    });
  }

  // Fetch all equipment
  fetchAllEquipment() {
    this.equipmentService.getAllEquipment().subscribe({
      next: (data) => {
        this.equipmentList = data; // Check that data contains equipmentId
        console.log(this.equipmentList); // Debugging: Log the full response
      },
      error: (err) => {
        this.errorMessage = 'Failed to load equipment';
      }
    });
  }
  

  // Fetch equipment by Site ID
  fetchEquipmentBySite() {
    if (this.selectedSiteId) {
      this.equipmentService.getEquipmentBySite(this.selectedSiteId).subscribe({
        next: (data) => (this.equipmentBySite = data),
        error: () => (this.errorMessage = 'Failed to fetch equipment by site'),
      });
    }
  }

  
  

  // Save or Update equipment
  saveEquipment() {
    if (this.equipmentForm.invalid) return;
  
    const formData = this.equipmentForm.value;
  
    if (this.isEditing) {
      this.equipmentService.updateEquipment(formData.equipmentId, formData).subscribe({
        next: () => {
          this.fetchAllEquipment();
          this.isEditing = false;
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update equipment';
        },
      });
    } else {
      delete formData.equipmentId; // Ensure ID is not sent for new equipment
      this.equipmentService.addEquipment(formData).subscribe({
        next: () => {
          this.fetchAllEquipment();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to add equipment';
        },
      });
    }
  }
  
  // Edit equipment
  editEquipment(data: any) {
    this.equipmentForm.patchValue(data);
    this.isEditing = true;
    this.setActiveTab('addUpdate');
  }

  // Delete equipment
  deleteEquipment(name: string) {
    this.equipmentService.deleteEquipment(name).subscribe({
      next: () => this.fetchAllEquipment(),
      error: () => (this.errorMessage = 'Failed to delete equipment you have no permissions to delete'),
    });
  }

  // Reset form
  resetForm() {
    this.isEditing = false;
    this.equipmentForm.reset();
  }
  assignEquipment() {
    if (!this.equipmentIdToAssign || !this.siteIdToAssign) {
      this.errorMessage = 'Please provide both Equipment ID and Site ID.';
      return;
    }
  
    console.log(`Assigning Equipment ID ${this.equipmentIdToAssign} to Site ID ${this.siteIdToAssign}`);
  
    this.equipmentService.assignEquipmentToSite(this.equipmentIdToAssign, this.siteIdToAssign).subscribe({
      next: (response) => {
        
        this.assignmentMessage = `The equipment ${this.equipmentIdToAssign} is assigned to the site ${this.siteIdToAssign}`;

        this.errorMessage = '';
        this.fetchAllEquipment();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Failed to assign equipment to site.';
        this.assignmentMessage = '';
      },
    });
  }
  removeEquipmentFromSite(equipmentId: number) {
    this.equipmentService.removeEquipmentFromSite(equipmentId).subscribe({
      next: (response) => {
        this.assignmentMessage = `Equipment ${equipmentId} has been removed from its assigned site.`;
        this.errorMessage = '';
        this.fetchAllEquipment(); // Refresh equipment list
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Failed to remove equipment from site.';
        this.assignmentMessage = '';
      },
    });
  }
  
  
}
