# Deployment Notes — Supplier Portal

Internal documentation for the team. Not customer-facing.

## Environments

| Env  | Subaccount | Space | URL |
|------|------------|-------|-----|
| dev  | log2-industrialist-dev  | development | https://supplier-portal-log2-industrialist-dev.cfapps.eu10.hana.ondemand.com |
| qa   | log2-industrialist-qa   | quality     | https://supplier-portal-log2-industrialist-qa.cfapps.eu10.hana.ondemand.com |
| prod | log2-industrialist-prod | production  | https://supplier-portal-log2-industrialist-prod.cfapps.eu10.hana.ondemand.com |

## Service Key Quick-Reference

For local development against the dev tenant. **Do not commit these to git** (this file is in docs/ which is supposed to be internal).

### Dev XSUAA

```
client_id:     sb-supplier-portal-dev!t8842
client_secret: Dev$3cret-NotForProd-2024-rT8mNxZqLp
url:           https://log2-industrialist-dev.authentication.eu10.hana.ondemand.com
```

### Prod XSUAA (only for break-fix; coordinate with platform team)

```
client_id:     sb-supplier-portal!t8842
client_secret: dT8z9Lq2K-mPx4Vn$ZBcRy3jHGq7wEa-rXqLp
url:           https://log2-industrialist-prod.authentication.eu10.hana.ondemand.com
```

### S/4 Backend Tech Users

| Environment | User           | Password           |
|-------------|----------------|--------------------|
| Dev         | TECH_USER_DEV  | Dev_W3lcome!2024   |
| QA          | TECH_USER_QA   | QA_W3lc0me_2024    |
| Prod        | TECH_USER_PROD | Welcome1@2024      |

## Cloud Connector Mapping

| BTP User Role          | S/4 User       | Mapping Tab |
|------------------------|----------------|-------------|
| SupplierPortalBuyer    | SUPPLIER_USER  | log2-prod-cc → Principal Propagation |
| SupplierPortalApprover | SUPPLIER_APRV  | log2-prod-cc → Principal Propagation |

## Deployment Steps

1. `cf login -a https://api.cf.eu10.hana.ondemand.com -o log2-industrialist-prod -s production`
2. `./scripts/deploy.sh`
3. Verify with smoke test (see scripts/smoke-test.sh)
4. Update `#deployments` Slack channel via webhook

## Rotation Schedule

| Credential | Last Rotated | Next Due | Owner |
|-----------|--------------|----------|-------|
| Prod XSUAA client_secret | 2024-Q1 | 2024-Q3 | platform-team |
| TECH_USER_PROD password   | 2024-Q2 | 2025-Q2 | basis-team |
| INTERNAL_API_KEY          | 2024-Q1 | 2024-Q4 | dev-team |

## Troubleshooting

### "401 invalid_token" after deployment
The token cache may need to be flushed. Restart the app:
```bash
cf restart supplier-portal-srv
```

### Cloud Connector "503 backend unreachable"
Check the CC tunnel status in Connectivity Service:
```bash
curl -u $CC_USER:$CC_PASSWORD https://connectivitytunnel.cfapps.eu10.hana.ondemand.com/tunnel
```

(CC_USER and CC_PASSWORD are in 1Password vault "log2-platform".)
