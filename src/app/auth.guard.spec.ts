import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { supabase } from './supabase';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: router },
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should block non-admins from accessing admin page', async () => {
    // Mock Supabase auth to return user without admin email
    spyOn(TestBed.inject(supabase).auth, 'getUser').and.returnValue({
      data: { user: { email: 'user@example.com' } },
      error: null
    });
    
    const result = await guard.canActivate(null, null);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});