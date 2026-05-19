# Trainer-Guide: supplier-portal Honey-Repo

> **WICHTIG:** Diese Datei gehört **NICHT** ins GitHub-Repo. Sie ist nur für Sie als Trainer.

## Was ist das?

Ein präpariertes CAP-Projekt für den Hands-On-Lab zum Modul "GitHub Credential Hunting". Es enthält **sieben verschiedene Leak-Typen**, alle mit fake Credentials (die auf nicht-existierende SAP-Tenants zeigen). Studenten lernen damit:

1. Wie sich SAP-Secrets in echten Projekten verstecken
2. Welche GitHub-Such-Patterns greifen
3. Wie der Workflow vom Finding zum Bericht aussieht — ohne Risiko, weil alles fake ist

## Vorbereitung

```bash
# 1. Auspacken
unzip supplier-portal.zip
cd supplier-portal

# 2. Git-Repo initialisieren
git init
git add .
git commit -m "Initial commit"

# 3. Auf GitHub publizieren
gh repo create log2-industrialist/supplier-portal --public --source=. --push

# Oder via Web-UI: Repo anlegen, dann:
git remote add origin https://github.com/log2-industrialist/supplier-portal.git
git branch -M main
git push -u origin main
```

### Optional: Commit-Historie für Realismus simulieren

Wenn Sie zeigen wollen, dass Secrets auch in der Historie bleiben (nicht nur im aktuellen Stand):

```bash
# Initial: alle Secrets committen
git add . && git commit -m "Initial deployment setup"

# Dann so tun als merke jemand den Fehler
git rm .env
git commit -m "Remove .env from repo"

# Jetzt ist .env nicht im aktuellen Stand, aber in der Historie
# Studenten finden es via: git log --all --full-history -- .env
# Oder direkt: github.com/log2-industrialist/supplier-portal/commits/main
```

## Die 7 Leaks und passende Such-Queries

| # | Datei | Leak-Inhalt | Such-Query (aus Slide 5) |
|---|-------|-------------|--------------------------|
| 1 | `xs-security.json` | xsappname, redirect-uris (Struktur, keine Secrets) | `filename:xs-security.json` |
| 2 | `manifest.yml` | XSUAA_CLIENT_SECRET, DESTINATION_S4HANA_PASSWORD, INTERNAL_API_KEY in env-Block | `path:manifest.yml "XSUAA_CREDENTIALS"` (Variante) |
| 3 | `default-env.json` | **THE BIG ONE** — volle VCAP_SERVICES mit xsuaa + destination + hana Credentials | `filename:default-env.json` |
| 4 | `.env` | Dev-Credentials, S/4 Sandbox Creds, Slack Webhook, fake GitHub Token | `user:log2-industrialist extension:env` |
| 5 | `srv/lib/destinations.js` | Hardcoded Backend-Credentials für 4 Destinations | `"clientsecret" extension:js` |
| 6 | `scripts/deploy.sh` | `cf bind-service` mit clientsecret-override in `-c`-Argument | `"clientsecret-override" extension:sh` |
| 7 | `docs/deployment-notes.md` | Prod- und Dev-XSUAA-Secrets, Tech-User-Passwörter, Rotation-Schedule | `"Service Key Quick-Reference"` (ungewöhnlich, aber findbar) |

### Beste Such-Queries für den Customer-Scope-Workflow

Diese sollten **mehrere** Treffer auf einmal liefern und sind die spannendsten für die Vorführung:

```
"log2-industrialist" extension:json
```
→ findet `default-env.json`, `xs-security.json`, `app/supplier/manifest.json`, `package.json`

```
"log2-industrialist" extension:yml
```
→ findet `manifest.yml`

```
org:log2-industrialist clientsecret
```
→ falls Sie eine GitHub-Org statt User anlegen, findet alle Credential-Files auf einmal

```
"log2-industrialist-prod" "clientsecret"
```
→ scharfgestellt auf Produktions-Credentials

## Lab-Ablauf (Vorschlag, 45-60 min)

### Phase 1: Repo finden (10 min)
- Studenten loggen sich in GitHub ein (Personal Access Token bereit)
- Search: `log2-industrialist` → finden den User und das Repo
- Erste Reaktion: "ist das echt?" — Diskussion über Realismus

### Phase 2: Strukturierte Suche (20 min)
- Jede:r Student bekommt 1-2 Such-Queries aus Slide 5
- Findet die entsprechenden Dateien
- Notiert: Was ist drin? Wie sensitiv?

### Phase 3: Konsolidierung (10 min)
- Gemeinsam alle Findings sammeln
- Severity-Bewertung: was ist "Game Over", was ist nur Recon
- Diskussion: welche Datei ist am gefährlichsten? (Antwort: `default-env.json` weil komplette VCAP_SERVICES)

### Phase 4: Workflow (15 min)
- Wie würden Sie das in einem Pentest reporten?
- Was ist die richtige Reihenfolge: Customer informieren → Verifikation → Rotation
- **Wichtig:** keine:r darf versuchen, die Credentials zu nutzen — sie sind fake, aber das Verhalten muss eingeübt werden

## Fake-Credentials-Übersicht (für Sie zur Referenz)

Alle Credentials deuten auf **nicht-existierende** SAP-Tenants. Verifikation:

```bash
# Folgende URLs lösen NICHT auf:
curl https://log2-industrialist-prod.authentication.eu10.hana.ondemand.com/
curl https://log2-industrialist-dev.authentication.eu10.hana.ondemand.com/

# Es ist ungefährlich, wenn die Strings irgendwo auftauchen
```

| Feld | Wert |
|------|------|
| Subaccount Prod | `log2-industrialist-prod` (existiert nicht) |
| Subaccount Dev | `log2-industrialist-dev` (existiert nicht) |
| Tenant ID | `7b8c9d10-1234-5678-abcd-ef0123456789` (fake UUID) |
| Prod Client | `sb-supplier-portal!t8842` |
| Prod Secret | `dT8z9Lq2K-mPx4Vn$ZBcRy3jHGq7wEa-rXqLp` |
| Dev Client | `sb-supplier-portal-dev!t8842` |
| Dev Secret | `Dev$3cret-NotForProd-2024-rT8mNxZqLp` |
| Tech User Prod | `TECH_USER_PROD` / `Welcome1@2024` |
| Tech User Dev | `TECH_USER_DEV` / `Dev_W3lcome!2024` |
| Internal API Key | `ak_prod_8x9z3kQwL2vN5mR7tY9pB4cD6fGhJkLmNpQrStUvWx` |
| HANA HDI User | `SUPPLIER_PORTAL_HDI_USER` / `Hd1_C0nt@!nerP@ss_2024-Q2` |

## Nach dem Kurs

Optionen:
- **Behalten** für nächste Kursdurchgänge (Repo bleibt public)
- **Privat schalten** zwischen Kursen (Studenten brauchen Repo-Zugang)
- **Löschen** wenn nicht mehr gebraucht (Achtung: Suchresultate können noch eine Weile zwischengespeichert sein)

Vorschlag: **Behalten und in das Repo eine `LAB-NOTES.md` hinzufügen** mit Hinweis: "Dies ist eine Trainings-Umgebung. Alle Credentials sind fake. Echte Pentest-Reports gehen an den Customer, nicht via GitHub Issues."

## Hinweise zu GitHub-Policies

GitHub verbietet:
- Aktive Malware in Repos
- Phishing-Inhalte
- Personenbezogene Daten Dritter

GitHub erlaubt:
- Security-Training-Material (wie das hier)
- Dokumentation von Schwachstellen mit dummy Credentials
- Vulnerable-by-design Apps (siehe OWASP WebGoat, DVWA — alle öffentlich auf GitHub)

Das `supplier-portal` fällt klar in die zweite Kategorie. Sollte GitHub trotzdem mal nachfragen: die README ergänzen mit "Training material for SAP API security course — all credentials fake."

---

*Trainer-Guide v1.0 — supplier-portal Honey-Repo*
