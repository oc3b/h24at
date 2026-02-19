import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  async getSuppliers(filters: any = {}) {
    let query = supabase.from('suppliers').select('*');
    
    // Only show approved suppliers by default
    if (!filters.status) {
      query = query.eq('status', 'approved');
    } else if (filters.status === 'pending' || filters.status === 'rejected') {
      query = query.eq('status', filters.status);
    }

    if (filters.woodType) {
      query = query.overlaps('types', [filters.woodType]);
    }

    if (filters.length) {
      query = query.eq('length', parseInt(filters.length));
    }

    if (filters.maxPrice) {
      query = query.lte('price', parseInt(filters.maxPrice));
    }

    if (filters.searchQuery) {
      const searchTerm = `%${filters.searchQuery}%`;
      query = query.or(`name.ilike.${searchTerm},address.ilike.${searchTerm}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getPendingSuppliers() {
    return this.getSuppliers({ status: 'pending' });
  }

  async updateSupplier(id: number, updates: any) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return data;
  }
}