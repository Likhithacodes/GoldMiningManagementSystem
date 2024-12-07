
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = 'http://localhost:5117/api/Report';

  constructor(private http: HttpClient) {}

  generateProductionReport(siteId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate/production/${siteId}`, null);
  }

  generateCostReport(siteId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate/cost/${siteId}`, null);
  }

  generateEquipmentReport(siteId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate/equipment/${siteId}`, null);
  }

  generateSafetyReport(siteId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate/safety/${siteId}`, null);
  }

  generateEnvironmentalReport(siteId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate/environment/${siteId}`, null);
  }

  getSiteAnalytics(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}/analytics`);
  }
}
