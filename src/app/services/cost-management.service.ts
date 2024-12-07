import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostManagementService {
  private baseUrl = 'http://localhost:5117/api/CostManagement';

  constructor(private http: HttpClient) {}

  getAllCosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getCostsBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}`);
  }

  getTotalExpensesBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}/total-expenses`);
  }

  getExpenseBreakdownBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}/expense-breakdown`);
  }

  addCost(cost: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, cost);
  }

  updateCost(id: number, cost: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, cost);
  }

  validateBudget(siteId: number, body: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.baseUrl}/site/${siteId}/validate-budget`, body, { headers });
  }
  
}
