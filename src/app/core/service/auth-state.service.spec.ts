import { TestBed } from '@angular/core/testing';
import { AuthStateService, CurrentUser } from './auth-state.service';

describe('AuthStateService', () => {
  let service: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have null user by default', () => {
    expect(service.getUser()).toBeNull();
  });

  it('should set and get the user', () => {
    const user: CurrentUser = { firstName: 'John', lastName: 'Doe', login: 'john.doe' };
    service.setUser(user);
    expect(service.getUser()).toEqual(user);
  });

  it('should clear the user', () => {
    const user: CurrentUser = { firstName: 'John', lastName: 'Doe', login: 'john.doe' };
    service.setUser(user);
    service.clearUser();
    expect(service.getUser()).toBeNull();
  });

  it('should emit user on user', (done) => {
    const user: CurrentUser = { firstName: 'John', lastName: 'Doe', login: 'john.doe' };
    service.user$.subscribe(emittedUser => {
      if (emittedUser !== null) {
        expect(emittedUser).toEqual(user);
        done();
      }
    });
    service.setUser(user);
  });

  it('should emit null on user after clearUser', (done) => {
    const user: CurrentUser = { firstName: 'John', lastName: 'Doe', login: 'john.doe' };
    service.setUser(user);

    let emissions = 0;
    service.user$.subscribe(emittedUser => {
      emissions++;
      if (emissions === 2) {
        expect(emittedUser).toBeNull();
        done();
      }
    });

    service.clearUser();
  });
});
