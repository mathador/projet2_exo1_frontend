import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) { }

  register(user: Register): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  login(user: Login): Observable<HttpResponse<any>> {
    // Ensure credentials (cookies) are sent/accepted by the browser so that
    // Set-Cookie from the server can create a HttpOnly session cookie.
    return this.httpClient.post<any>('/api/login', user, { observe: 'response', withCredentials: true });
  }
}
