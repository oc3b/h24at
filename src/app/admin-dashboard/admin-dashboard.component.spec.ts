import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { SupplierService } from '../supplier.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockSupplierService: jasmine.SpyObj<SupplierService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SupplierService', ['getPendingSuppliers', 'updateSupplier']);
    
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardComponent ],
      providers: [{ provide: SupplierService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    mockSupplierService = TestBed.inject(SupplierService) as jasmine.SpyObj<SupplierService>;
  });

  it('should load pending suppliers on init', async () => {
    const mockSuppliers = [{ id: 1, name: 'Acme Wood' }];
    mockSupplierService.getPendingSuppliers.and.returnValue(Promise.resolve(mockSuppliers));
    
    await component.ngOnInit();
    expect(component.pendingSuppliers).toEqual(mockSuppliers);
  });

  it('should approve supplier and refresh table', async () => {
    const mockSupplier = { id: 1, name: 'Test Supplier' };
    mockSupplierService.updateSupplier.and.returnValue(Promise.resolve({ status: 'approved' }));
    mockSupplierService.getPendingSuppliers.and.returnValue(Promise.resolve([]));
    
    await component.approve(mockSupplier);
    
    expect(mockSupplierService.updateSupplier).toHaveBeenCalledWith(1, { status: 'approved' });
    expect(component.pendingSuppliers).toEqual([]);
  });
};