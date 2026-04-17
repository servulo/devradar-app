resource "azurerm_resource_group" "devradar" {
  name     = var.resource_group_name
  location = var.location
}