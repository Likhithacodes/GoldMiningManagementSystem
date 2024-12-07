import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductionService {
  private baseUrl = 'http://localhost:5117/api/Production';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}`);
  }

  getDailyProduction(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/daily/${siteId}`);
  }

  getWeeklyProduction(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/weekly/${siteId}`);
  }

  getMonthlyProduction(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/monthly/${siteId}`);
  }

  getYieldEfficiencyForAllSites(): Observable<any> {
    return this.http.get(`${this.baseUrl}/yield-efficiency`);
  }

  addProduction(production: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, production);
  }

  updateProduction(id: number, production: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, production);
  }
}
