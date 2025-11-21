import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CurrentUser {
  firstName?: string;
  lastName?: string;
  login?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly userSubject = new BehaviorSubject<CurrentUser | null>(null);
  public user$ = this.userSubject.asObservable();

  setUser(user: CurrentUser | null): void {
    this.userSubject.next(user);
  }

  getUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    this.userSubject.next(null);
  }
}
