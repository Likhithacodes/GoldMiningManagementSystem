import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SafetyIncidentService {
  private baseUrl = 'http://localhost:5117/api/SafetyIncident';

  constructor(private http: HttpClient) {}

  // Get all incidents
  getAllIncidents(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get incident by ID
  getIncidentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Get incidents by Site ID
  getIncidentsBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}`);
  }

  // Add a new incident
  addIncident(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // Update an incident
  updateIncident(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }
}
