import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinePlanService {
  private baseUrl = 'http://localhost:5117/api/MinePlan';

  constructor(private http: HttpClient) {}

  getAllMinePlans(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getMinePlanById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getMinePlansBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}`);
  }

  addMinePlan(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  updateMinePlan(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteMinePlan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  validateSchedule(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/validate-schedule`, data);
  }

  notifyExpiration(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/notify-expiration/${id}`, null);
  }
}

