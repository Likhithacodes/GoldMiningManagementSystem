import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule,NgClass],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() userRole: string = ''; 
 

  constructor(private AuthService: AuthService, private router: Router) {}
  
  links: { [key: string]: { name: string; route: string }[] } = {
    MineManager: [
      { name: 'Sites', route: '/sites' },
      { name: 'production', route: '/production' },
      { name: 'Geological-Data', route: '/geological-data' },
      { name: 'Safety Incidents', route: '/safety-incidents' },
      { name: 'Mine Planning', route: '/mine-planning' },
      { name: 'Equipment', route: '/Equipment' },
      { name: 'Cost Management', route: '/cost-management' },
      { name: 'Reports', route: '/reports' },
      { name: 'Environmental Data', route: '/environmental-data' },
    ],
    Geologist: [
      { name: 'Sites', route: '/sites' },
      { name: 'Geological Data', route: '/geological-data' },
      { name: 'Safety Incidents', route: '/safety-incidents' },
    ],
    Admin: [
      { name: 'Sites', route: '/sites' },
      { name: 'Production', route: '/production' },
      { name: 'Geological Data', route: '/geological-data' },
      { name: 'Safety Incidents', route: '/safety-incidents' },
      { name: 'Mine Planning', route: '/mine-planning' },
      { name: 'Equipment', route: '/Equipment' },
      { name: 'Cost Management', route: '/cost-management' },
      { name: 'Reports', route: '/reports' },
      { name: 'Environmental Data', route: '/environmental-data' },
    ],
    Engineer:[
      { name: 'Sites', route: '/sites' },
      { name: 'Mine Planning', route: '/mine-planning' },
      { name: 'production', route: '/production' },
      { name: 'Equipment', route: '/Equipment' },
      { name: 'Safety Incidents', route: '/safety-incidents' },
      { name: 'Geological Data', route: '/geological-data' },
      { name: 'Environmental Data', route: '/environmental-data' },
      { name: 'Cost Management', route: '/cost-management' },
    ],
    SafetyOfficer:[
      { name: 'Sites', route: '/sites' },
      { name: 'Safety Incidents', route: '/safety-incidents' },
      { name: 'Geological Data', route: '/geological-data' },

    ]
  };

  // Dynamically fetch links based on the role
  getLinks() {
    return this.links[this.userRole] || [];
  }
  logout() {
    this.AuthService.logout();
    this.router.navigate(['/login']);
  }
}
