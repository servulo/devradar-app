resource "azurerm_log_analytics_workspace" "devradar" {
  name                = "sprj-log-devradar"
  resource_group_name = azurerm_resource_group.devradar.name
  location            = azurerm_resource_group.devradar.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "devradar" {
  name                       = "sprj-cae-devradar"
  resource_group_name        = azurerm_resource_group.devradar.name
  location                   = azurerm_resource_group.devradar.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.devradar.id
}

data "azurerm_container_registry" "shared" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group
}

resource "azurerm_container_app" "backend" {
  name                         = "sprj-ca-devradar-backend"
  resource_group_name          = azurerm_resource_group.devradar.name
  container_app_environment_id = azurerm_container_app_environment.devradar.id
  revision_mode                = "Single"

  registry {
    server               = data.azurerm_container_registry.shared.login_server
    username             = data.azurerm_container_registry.shared.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = data.azurerm_container_registry.shared.admin_password
  }

  template {
    min_replicas = 1
    max_replicas = 1

    container {
      name   = "devradar-backend"
      image  = "${data.azurerm_container_registry.shared.login_server}/devradar-backend:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "DB_HOST"
        value = azurerm_postgresql_flexible_server.devradar.fqdn
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name  = "DB_USERNAME"
        value = var.postgres_admin_user
      }
      env {
        name  = "DB_PASSWORD"
        value = var.postgres_admin_password
      }
      env {
        name  = "DB_DATABASE"
        value = "devradardb"
      }
      env {
        name  = "WEATHER_API_URL"
        value = "https://api.openweathermap.org/data/2.5"
      }
      env {
        name  = "PORT"
        value = "3000"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}