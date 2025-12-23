output "ssh_host" {
  value = var.ssh_host
}

output "message" {
  value = "After apply, frontend should be reachable at http://${var.ssh_host}:30000 (NodePort)."
}
