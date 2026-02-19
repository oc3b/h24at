import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { supabase } from './supabase';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if user is admin (in real app, use roles)
    const isValidAdmin = user?.email?.endsWith('@yourdomain.com');
    
    if (!user || !isValidAdmin) {
      this.router.navigate(['/']);
      return false;
    }
    
    return true;
  }
}