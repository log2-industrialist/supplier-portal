using { log2.supplier as my } from '../db/schema';

@path: '/catalog'
service CatalogService @(requires: 'authenticated-user') {

  @restrict: [
    { grant: 'READ',   to: 'SupplierPortal.Read' },
    { grant: 'WRITE',  to: 'SupplierPortal.Write' }
  ]
  entity Suppliers as projection on my.Suppliers;

  @restrict: [
    { grant: 'READ',   to: 'SupplierPortal.Read' },
    { grant: 'CREATE', to: 'SupplierPortal.Write' },
    { grant: 'UPDATE', to: 'SupplierPortal.Write' }
  ]
  entity PurchaseOrders as projection on my.PurchaseOrders actions {
    @restrict: [{ grant: '*', to: 'SupplierPortal.Approve' }]
    action approve();
  };

  entity PurchaseOrderItems as projection on my.PurchaseOrderItems;

  @restrict: [{ grant: '*', to: 'SupplierPortal.Admin' }]
  action syncFromS4() returns { synced: Integer };
}
