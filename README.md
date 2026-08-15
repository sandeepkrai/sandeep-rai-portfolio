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