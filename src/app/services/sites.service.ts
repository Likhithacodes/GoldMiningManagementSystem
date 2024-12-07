import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SitesService {
  private baseUrl = 'http://localhost:5117/api/Sites';

  constructor(private http: HttpClient) {}

  getAllSites(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getSitesByManager(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/manager/${username}`);
  }

  getSiteById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addSite(site: any): Observable<any> {
    console.log(site);
    return this.http.post(`${this.baseUrl}`, site);
  }

  updateSite(site: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${site.siteId}`, site);
  }

  deleteSite(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  searchByLocation(location: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/${location}`);
  }
  
}
