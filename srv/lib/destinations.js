/**
 * Destination configurations for backend systems.
 * 
 * TODO: migrate to Destination Service before going live.
 * For now keeping inline because the Destination Service binding
 * has issues with the on-prem trust certificate.
 * 
 * See ticket SUPPL-1247.
 */

const destinations = {
  // S/4 HANA on-prem via Cloud Connector
  S4HANA_PROD: {
    url: "http://s4hana-prod.internal.log2-industrialist.local:50000",
    authentication: "BasicAuthentication",
    user: "TECH_USER_PROD",
    password: "Welcome1@2024",
    proxyType: "OnPremise",
    locationId: "log2-prod-cc"
  },

  S4HANA_DEV: {
    url: "http://s4hana-dev.internal.log2-industrialist.local:50000",
    authentication: "BasicAuthentication",
    user: "TECH_USER_DEV",
    password: "Dev_W3lcome!2024",
    proxyType: "OnPremise",
    locationId: "log2-dev-cc"
  },

  // External supplier portal API (third-party SaaS)
  SUPPLIER_HUB: {
    url: "https://api.supplierhub.example.com/v2",
    authentication: "OAuth2ClientCredentials",
    clientId: "lo2g-ind-supplier-portal-prod",
    clientSecret: "shub_secret_3xR4nDOm5tR1nGs8L0okREaL2024",
    tokenServiceURL: "https://auth.supplierhub.example.com/oauth/token"
  },

  // Internal master data service
  MDM_INTERNAL: {
    url: "https://mdm.internal.log2-industrialist.local",
    authentication: "BasicAuthentication",
    user: "SUPPLIER_PORTAL_SVC",
    password: "M@sterD@ta_2024_Q2!",
    proxyType: "OnPremise",
    locationId: "log2-prod-cc"
  }
};

function getDestination(name) {
  if (!destinations[name]) {
    throw new Error(`Unknown destination: ${name}`);
  }
  return destinations[name];
}

module.exports = { getDestination, destinations };
