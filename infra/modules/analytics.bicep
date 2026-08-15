param location string
param workspaceName string
param appInsightsName string
param tags object

module logAnalytics 'br/public:avm/res/operational-insights/workspace:0.16.0' = {
  name: 'log-analytics-workspace'
  params: {
    name: workspaceName
    location: location
    tags: tags
    skuName: 'PerGB2018'
    dataRetention: 30
    dailyQuotaGb: '0.5'
    features: {
      disableLocalAuth: true
      enableLogAccessUsingOnlyResourcePermissions: true
      immediatePurgeDataOn30Days: true
    }
    forceCmkForQuery: false
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    enableTelemetry: false
  }
}

module appInsights 'br/public:avm/res/insights/component:0.8.0' = {
  name: 'application-insights'
  params: {
    name: appInsightsName
    location: location
    tags: tags
    workspaceResourceId: logAnalytics.outputs.resourceId
    applicationType: 'web'
    kind: 'web'
    ingestionMode: 'LogAnalytics'
    retentionInDays: 30
    immediatePurgeDataOn30Days: true
    samplingPercentage: 100
    disableIpMasking: false
    disableLocalAuth: false
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    enableTelemetry: false
  }
}

var workbookItems = [
  {
    type: 1
    content: {
      json: '# Portfolio analytics\nAnonymous, cookieless traffic and engagement for the production portfolio. Visit IDs exist only for one page load and are never persisted.'
    }
    name: 'analytics-overview'
  }
  {
    type: 3
    content: {
      version: 'KqlItem/1.0'
      title: '30-day overview'
      query: 'let visits = AppEvents | where TimeGenerated >= ago(30d) and Name == "portfolio_visit" | summarize Visits=count();\nlet pages = AppPageViews | where TimeGenerated >= ago(30d) | summarize PageViews=count();\nlet conversions = AppEvents | where TimeGenerated >= ago(30d) and Name in ("resume_opened", "project_opened", "email_clicked", "phone_clicked", "linkedin_clicked", "certificate_opened") | summarize Conversions=count();\nvisits | extend PageViews=toscalar(pages), Conversions=toscalar(conversions)'
      size: 1
      queryType: 0
      resourceType: 'microsoft.insights/components'
      visualization: 'table'
    }
    name: 'thirty-day-overview'
  }
  {
    type: 3
    content: {
      version: 'KqlItem/1.0'
      title: 'Daily visits'
      query: 'AppEvents\n| where TimeGenerated >= ago(30d) and Name == "portfolio_visit"\n| summarize Visits=count() by bin(TimeGenerated, 1d)\n| order by TimeGenerated asc'
      size: 0
      queryType: 0
      resourceType: 'microsoft.insights/components'
      visualization: 'timechart'
    }
    name: 'daily-visits'
  }
  {
    type: 3
    content: {
      version: 'KqlItem/1.0'
      title: 'Sections reached'
      query: 'AppEvents\n| where TimeGenerated >= ago(30d) and Name == "section_viewed"\n| extend Section=tostring(Properties.section)\n| summarize Views=count() by Section\n| order by Views desc'
      size: 0
      queryType: 0
      resourceType: 'microsoft.insights/components'
      visualization: 'barchart'
    }
    name: 'sections-reached'
  }
  {
    type: 3
    content: {
      version: 'KqlItem/1.0'
      title: 'Conversion actions'
      query: 'AppEvents\n| where TimeGenerated >= ago(30d) and Name in ("resume_opened", "project_opened", "email_clicked", "phone_clicked", "linkedin_clicked", "certificate_opened")\n| summarize Actions=count() by Name\n| order by Actions desc'
      size: 0
      queryType: 0
      resourceType: 'microsoft.insights/components'
      visualization: 'barchart'
    }
    name: 'conversion-actions'
  }
  {
    type: 3
    content: {
      version: 'KqlItem/1.0'
      title: 'Page performance'
      query: 'AppPageViews\n| where TimeGenerated >= ago(30d)\n| summarize PageViews=count(), AverageLoadSeconds=round(avg(DurationMs) / 1000, 2), P95LoadSeconds=round(percentile(DurationMs, 95) / 1000, 2)'
      size: 0
      queryType: 0
      resourceType: 'microsoft.insights/components'
      visualization: 'table'
    }
    name: 'page-performance'
  }
  {
    type: 3
    content: {
      version: 'KqlItem/1.0'
      title: 'Client errors'
      query: 'AppExceptions\n| where TimeGenerated >= ago(30d)\n| summarize Errors=count() by ProblemId, OuterMessage\n| top 10 by Errors desc'
      size: 0
      queryType: 0
      resourceType: 'microsoft.insights/components'
      visualization: 'table'
    }
    name: 'client-errors'
  }
]

resource analyticsWorkbook 'Microsoft.Insights/workbooks@2023-06-01' = {
  name: guid(resourceGroup().id, 'portfolio-analytics')
  location: location
  kind: 'shared'
  tags: tags
  properties: {
    displayName: 'Sandeep Rai Portfolio Analytics'
    description: 'Private traffic, engagement, conversion, performance, and client-error analytics.'
    category: 'workbook'
    sourceId: appInsights.outputs.resourceId
    version: 'Notebook/1.0'
    serializedData: string({
      version: 'Notebook/1.0'
      items: workbookItems
      fallbackResourceIds: [
        appInsights.outputs.resourceId
      ]
      '$schema': 'https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/schema/workbook.json'
    })
  }
}

output applicationInsightsResourceId string = appInsights.outputs.resourceId
output applicationInsightsConnectionString string = appInsights.outputs.connectionString
output logAnalyticsWorkspaceId string = logAnalytics.outputs.resourceId
output workbookId string = analyticsWorkbook.id