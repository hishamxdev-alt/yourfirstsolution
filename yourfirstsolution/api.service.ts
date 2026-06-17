import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl =environment.apiUrl // 'http://localhost:5000/api';  // backend URL

  constructor(private http: HttpClient, private activeroute: Router) {}

  //   POST to send data to the backend
  postData(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;

    // Create headers
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')  // Set the content type as JSON
      // .set('Authorization', 'Bearer your-jwt-token');  // Optional: add Authorization header if needed

    // Make the POST request with the headers
    return this.http.post<any>(url, data, { headers });
  }
postFormData(endpoint: string, formData: FormData): Observable<any> {
  // const url = `https://yourfirstsolution.com/${endpoint}`;
      const url = `${this.apiUrl}/${endpoint}`;

  return this.http.post<any>(url, formData, {
    responseType: 'json'
  });
}

  //   GET  data from the backend
getData(endpoint: string): Observable<any> {
  const url = `${this.apiUrl}/${endpoint}`;
  return this.http.get<any>(url); // No Authorization header
}
 
deleteData(endpoint: string, data: any): Observable<any> {
  const url = `${this.apiUrl}/${endpoint}`;
      // Create headers
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')  // Set the content type as JSON
      // .set('Authorization', 'Bearer your-jwt-token');  // Optional: add Authorization header if needed

    // Make the POST request with the headers
    return this.http.post<any>(url,data,  { headers });

}
 


  trackVisitor() {
    if (!sessionStorage.getItem('visitorTracked')) {
    
      if ( this.activeroute.url !='/control-panel') {
        const device_type = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
        return this.http.post(`${this.apiUrl}/track-visitor.php`, { device_type }).subscribe(
          response => {
             sessionStorage.setItem('visitorTracked', 'true'); 
          },
          error => {
          console.error('Error :', error);
        }
      );
    }
    
  } 
 
  }
  
}
