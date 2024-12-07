import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeologicalDataService {
  private baseUrl = 'http://localhost:5117/api/GeologicalData';

  constructor(private http: HttpClient) {}

  getAllGeologicalData(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getGeologicalDataBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}`);
  }

  addGeologicalData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  updateGeologicalData(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${data.dataId}`, data);
  }
}
