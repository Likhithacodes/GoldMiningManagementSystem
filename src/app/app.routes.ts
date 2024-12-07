import { Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './shared/home/home.component';
import { RoleGuard } from './services/role.guard';
import { SitesComponent } from './routes/sites/sites.component';
import { ProductionComponent } from './routes/production/production.component';
import { GeologicalDataComponent } from './routes/geological-data/geological-data.component';
import { EquipmentComponent } from './routes/equipment/equipment.component';
import { SafetyIncidentComponent } from './routes/safety-incident/safety-incident.component';
import { MinePlanComponent } from './routes/mine-plan/mine-plan.component';
import { CostManagementComponent } from './routes/cost-management/cost-management.component';
import { ReportComponent } from './routes/report/report.component';
import { EnvironmentalDataComponent } from './routes/environmental-data/environmental-data.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: RegisterComponent },
    {path:'Home',component:HomeComponent, canActivate: [RoleGuard],data: { roles: ['MineManager', 'SafetyOfficer','Geologist','Engineer','Admin'] }},
    {path:'sites',component:SitesComponent, canActivate: [RoleGuard],data: { roles: ['MineManager', 'SafetyOfficer','Geologist','Engineer','Admin'] }},
    {path:'production',component:ProductionComponent,canActivate: [RoleGuard],data: { roles: ['MineManager','Engineer','Admin'] }},
    {path:'geological-data',component:GeologicalDataComponent,canActivate: [RoleGuard],data: { roles: ['MineManager', 'SafetyOfficer','Geologist','Engineer','Admin'] }},
    {path:'Equipment',component:EquipmentComponent,canActivate: [RoleGuard],data: { roles: ['MineManager','Engineer','Admin'] }},
    {path:'safety-incidents',component:SafetyIncidentComponent,canActivate: [RoleGuard],data: { roles: ['MineManager', 'SafetyOfficer','Geologist','Engineer','Admin'] }},
    {path:'mine-planning',component:MinePlanComponent,canActivate: [RoleGuard],data: { roles: ['MineManager','Engineer','Admin'] }},
    {path:'cost-management',component:CostManagementComponent,canActivate: [RoleGuard],data: { roles: ['MineManager','Engineer','Admin'] }},
    {path:'reports',component:ReportComponent,canActivate: [RoleGuard],data: { roles: ['MineManager','Admin'] }},
    {path:'environmental-data',component:EnvironmentalDataComponent}
];
