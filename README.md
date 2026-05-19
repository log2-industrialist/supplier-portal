# Supplier Portal

A SAP CAP-based application for managing suppliers and purchase orders, built for the **log2-industrialist** procurement team.

## Features

- Supplier master data management with versioning
- Purchase order tracking and approval workflow
- Integration with S/4HANA via Cloud Connector
- Role-based access control via XSUAA
- OData v4 API for partner integrations

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  Fiori App  │─────▶│  CAP Service │─────▶│  S/4 HANA   │
│  (UI5)      │      │  (Node.js)   │      │  (on-prem)  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  XSUAA       │
                     │  (Auth)      │
                     └──────────────┘
```

## Prerequisites

- Node.js 18+
- `@sap/cds-dk` installed globally
- Cloud Foundry CLI
- Access to log2-industrialist BTP subaccount

## Getting Started

```bash
npm install
cds watch
```

The service will run on http://localhost:4004. UI is available at http://localhost:4004/supplier/webapp/index.html.

## Deployment to BTP

See [docs/deployment-notes.md](docs/deployment-notes.md) for the full deployment guide including service bindings and Cloud Connector configuration.

Quick deploy:
```bash
./scripts/deploy.sh
```

## API

The service exposes the following OData v4 endpoints:

- `GET /catalog/Suppliers` — list all suppliers
- `GET /catalog/Suppliers({id})` — single supplier
- `POST /catalog/PurchaseOrders` — create PO
- `GET /catalog/PurchaseOrders?$expand=items` — list with line items

## Contributing

PRs welcome. Please run `npm test` before submitting.

## License

MIT © log2-industrialist
