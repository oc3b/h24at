import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  pendingSuppliers: any[] = [];
  error: string = '';

  constructor(private supplierService: SupplierService) {}

  async ngOnInit() {
    try {
      this.pendingSuppliers = await this.supplierService.getPendingSuppliers();
    } catch (error) {
      this.error = 'Failed to load pending suppliers: ' + error.message;
    }
  }

  async approve(supplier: any) {
    try {
      await this.supplierService.updateSupplier(supplier.id, { status: 'approved' });
      this.pendingSuppliers = await this.supplierService.getPendingSuppliers();
    } catch (error) {
      this.error = 'Failed to approve supplier: ' + error.message;
    }
  }

  async reject(supplier: any) {
    try {
      await this.supplierService.updateSupplier(supplier.id, { status: 'rejected' });
      this.pendingSuppliers = await this.supplierService.getPendingSuppliers();
    } catch (error) {
      this.error = 'Failed to reject supplier: ' + error.message;
    }
  }
}