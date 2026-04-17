resource "azurerm_postgresql_flexible_server" "devradar" {
  name                   = "sprj-psql-devradar"
  resource_group_name    = azurerm_resource_group.devradar.name
  location               = azurerm_resource_group.devradar.location
  administrator_login    = var.postgres_admin_user
  administrator_password = var.postgres_admin_password
  sku_name               = "B_Standard_B1ms"
  version                = "16"
  zone                   = "1"

  storage_mb = 32768
}

resource "azurerm_postgresql_flexible_server_database" "devradardb" {
  name      = "devradardb"
  server_id = azurerm_postgresql_flexible_server.devradar.id
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.devradar.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}