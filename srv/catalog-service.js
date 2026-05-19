const cds = require('@sap/cds'); 
const { getDestination } = require('./lib/destinations');

module.exports = cds.service.impl(async function() {
  const { Suppliers, PurchaseOrders, PurchaseOrderItems } = this.entities;

  // Standard CRUD is handled by CAP automatically.
  // Custom logic below.

  this.before('CREATE', PurchaseOrders, async (req) => {
    // Auto-generate PO number
    const year = new Date().getFullYear();
    const count = await SELECT.one`count(*)`.from(PurchaseOrders)
      .where`poNumber like ${'PO-' + year + '-%'}`;
    const next = (count.COUNT || 0) + 1;
    req.data.poNumber = `PO-${year}-${String(next).padStart(5, '0')}`;
    req.data.status = 'draft';
  });

  this.on('approve', 'PurchaseOrders', async (req) => {
    const po = await SELECT.one.from(PurchaseOrders).where({ ID: req.params[0].ID });
    if (!po) req.error(404, 'Purchase order not found');
    
    // Check user has Approve scope
    if (!req.user.is('SupplierPortal.Approve')) {
      req.error(403, 'Approver role required');
    }
    
    await UPDATE(PurchaseOrders)
      .set({ status: 'approved', approvedBy: req.user.id })
      .where({ ID: req.params[0].ID });
    
    return { message: `PO ${po.poNumber} approved` };
  });

  this.on('syncFromS4', async (req) => {
    const dest = getDestination('S4HANA_PROD');
    const axios = require('axios');
    
    const auth = Buffer.from(`${dest.user}:${dest.password}`).toString('base64');
    const response = await axios.get(`${dest.url}/sap/opu/odata/sap/API_SUPPLIER_SRV/Suppliers`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    
    return { synced: response.data.d.results.length };
  });
});
