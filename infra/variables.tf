variable "location" {
  default = "brazilsouth"
}

variable "resource_group_name" {
  default = "sprj-rg-devradar"
}

variable "postgres_admin_user" {
  default = "devradaradmin"
}

variable "postgres_admin_password" {
  description = "Senha do PostgreSQL"
  sensitive   = true
}

variable "acr_name" {
  default = "sprjacrshared"
}

variable "acr_resource_group" {
  default = "sprj-rg-shared"
}