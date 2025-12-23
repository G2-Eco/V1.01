variable "ssh_host" {
  description = "IP or hostname of the Ubuntu 22 VM"
  type        = string
}

variable "ssh_user" {
  description = "SSH user with sudo privileges"
  type        = string
}

variable "ssh_private_key_path" {
  description = "Path to the private key that can ssh into the VM (e.g. ~/.ssh/id_rsa)"
  type        = string
}

variable "ssh_password" {
  description = "Password for the remote SSH user."
  type        = string
  sensitive   = true  # RECOMMENDED: Keeps the value out of the plan output
}