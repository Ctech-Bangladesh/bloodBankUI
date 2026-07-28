import { BehaviorSubject } from 'rxjs';

// Older builds stored the literal strings "undefined"/"null" when the Bahmni
// cookies were missing; treat those as logged out.
function sanitize(value: string | null): string | null {
  return value && value !== 'undefined' && value !== 'null' ? value : null;
}

const currentUserSubject = new BehaviorSubject<string | null>(
  sanitize(localStorage.getItem('currentUser'))
);

export const authenticationService = {
  logout,
  setCurrentUser,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() { return currentUserSubject.value }
};

function setCurrentUser(user: string) {
  localStorage.setItem('currentUser', user);
  currentUserSubject.next(user);
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}
