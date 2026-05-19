namespace log2.supplier;

using { managed, cuid, Country } from '@sap/cds/common';

entity Suppliers : cuid, managed {
  name           : String(100) @mandatory;
  legalForm      : String(20);
  taxId          : String(30);
  vatNumber      : String(20);
  country        : Country;
  city           : String(50);
  street         : String(100);
  zip            : String(10);
  contactEmail   : String(100);
  contactPhone   : String(30);
  status         : String enum { active; inactive; blocked };
  rating         : Integer @assert.range: [1, 5];
  notes          : String(1000);
  
  purchaseOrders : Association to many PurchaseOrders on purchaseOrders.supplier = $self;
}

entity PurchaseOrders : cuid, managed {
  poNumber       : String(20) @mandatory;
  supplier       : Association to Suppliers;
  orderDate      : Date;
  deliveryDate   : Date;
  totalAmount    : Decimal(15, 2);
  currency       : String(3);
  status         : String enum { draft; submitted; approved; rejected; closed };
  approvedBy     : String(50);
  
  items          : Composition of many PurchaseOrderItems on items.po = $self;
}

entity PurchaseOrderItems : cuid {
  po             : Association to PurchaseOrders;
  position       : Integer;
  materialCode   : String(30);
  description    : String(200);
  quantity       : Decimal(10, 3);
  unit           : String(5);
  unitPrice      : Decimal(15, 2);
  totalPrice     : Decimal(15, 2);
}
