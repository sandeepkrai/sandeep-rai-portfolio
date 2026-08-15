targetScope = 'subscription'

@minLength(1)
@maxLength(64)
param environmentName string

@minLength(1)
param location string

param sessionId string
param deployedBy string
param createdAt string

#disable-next-line no-unused-params
param deployerObjectId string

var resourceGroupName = 'rg-sandeep-rai-portfolio-prod-3083'
var staticWebAppName = 'swa-sandeep-rai-portfolio-prod-3083'
var logAnalyticsWorkspaceName = 'log-sandeep-rai-portfolio-prod-3083'
var applicationInsightsName = 'appi-sandeep-rai-portfolio-prod-3083'
var tags = {
  'app-onboard-skill': 'true'
  'app-onboard-session-id': sessionId
  'created-at': createdAt
  environment: environmentName
  'deployed-by': deployedBy
}

resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

module staticWebApp './modules/static-web-app.bicep' = {
  name: 'static-web-app'
  scope: rg
  params: {
    location: location
    swaName: staticWebAppName
    tags: tags
  }
}

module analytics './modules/analytics.bicep' = {
  name: 'portfolio-analytics'
  scope: rg
  params: {
    location: location
    workspaceName: logAnalyticsWorkspaceName
    appInsightsName: applicationInsightsName
    tags: tags
  }
}

output applicationInsightsResourceId string = analytics.outputs.applicationInsightsResourceId
output applicationInsightsConnectionString string = analytics.outputs.applicationInsightsConnectionString
output logAnalyticsWorkspaceId string = analytics.outputs.logAnalyticsWorkspaceId
output analyticsWorkbookId string = analytics.outputs.workbookId
