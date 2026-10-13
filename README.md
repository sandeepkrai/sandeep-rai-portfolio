# Sandeep Rai Portfolio

An immersive, responsive engineering portfolio built with React and Vite.

## Local development

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```powershell
npm run build
npm run preview
```

The production output is written to `dist/`.

## Deployment

The site is hosted on Azure Static Web Apps. Pushes to `main` are deployed by GitHub Actions after the Azure deployment workflow and repository secret are configured.

Infrastructure is defined in `infra/` using Bicep. The Azure Static Web App uses the Free hosting plan with managed HTTPS.

### Custom domain

The intended primary address is `https://raisandeep.in`, with `www.raisandeep.in` also bound to the existing Static Web App. DNS remains hosted at GoDaddy.

| Type | Name | Target |
| --- | --- | --- |
| A | @ | 20.187.235.169 |
| CNAME | www | lemon-flower-0a1673100.7.azurestaticapps.net |
| TXT | @ | Azure-generated ownership verification value, managed in GoDaddy |

The A record uses the app's `stableInboundIP`; verify that property before changing the target. This root-domain configuration routes through a regional Azure endpoint. GoDaddy domain forwarding must remain disabled so the custom hostname stays in the address bar.

Azure manages TLS certificates. After both bindings show **Validated**, select `raisandeep.in` under **Custom domains** and use **Set default** to redirect alternate hostnames to it. DNS caches and Azure validation may take time to update; do not bypass certificate validation while testing.

The deployment workflow allows analytics on both custom hostnames and the original Azure hostname. Browser automation logs are ignored and must not be committed.