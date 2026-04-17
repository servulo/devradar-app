output "backend_url" {
  value = "https://${azurerm_container_app.backend.latest_revision_fqdn}"
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.devradar.fqdn
}