import { TestBed } from '@angular/core/testing';
import { SupplierService } from './supplier.service';
import { supabase } from './supabase';

describe('SupplierService', () => {
  let service: SupplierService;
  let mockSupabase: jasmine.SpyObj<supabase>;

  beforeEach(() => {
    mockSupabase = jasmine.createSpyObj('supabase', ['from', 'select', 'eq', 'lte', 'overlaps', 'or']);
    TestBed.configureTestingModule({
      providers: [
        SupplierService,
        { provide: supabase, useValue: mockSupabase }
      ]
    });
    service = TestBed.inject(SupplierService);
  });

  it('should filter suppliers by status', async () => {
    mockSupabase.from.and.returnValue({
      select: () => ({
        eq: () => ({
          select: () => ({ data: [{ id: 1 }], error: null })
        })
      })
    });
    
    await service.getSuppliers({ status: 'pending' });
    expect(mockSupabase.from().select().eq).toHaveBeenCalledWith('status', 'pending');
  });
};