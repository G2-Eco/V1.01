# Define the required providers
terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    
  }
}

# Provider configuration. Terraform will automatically use
# your KUBECONFIG file (usually created by K3s)
provider "kubernetes" {
	config_path    = "/etc/rancher/k3s/k3s.yaml"
  # Configuration is optional if KUBECONFIG is set
}

# --- Infrastructure Resources ---

# 1. Namespace
resource "kubernetes_namespace_v1" "project_namespace" {
  metadata {
    name = var.namespace_name
  }
}

# 2. MySQL PVC (Using the YAML file content)
# You would need to read the content of mysql-pvc.yaml here.
# For simplicity, let's use the standard deployment resource below.
# A better practice for existing YAMLs is using the 'kubectl_manifest' or 'helm' providers,
# but for a class demo, defining them natively is clearer.

# Example: MySQL Deployment
resource "kubernetes_deployment_v1" "mysql" {
  metadata {
    name = "mysql-deployment"
    namespace = kubernetes_namespace_v1.project_namespace.metadata[0].name
    labels = {
      app = "mysql"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "mysql"
      }
    }
    template {
      metadata {
        labels = {
          app = "mysql"
        }
      }
      spec {
        container {
          name  = "mysql"
          image = "mysql:5.7"
          port {
            container_port = 3306
          }
          env {
            name = "MYSQL_ROOT_PASSWORD"
            value = "root" 
          }
        }
      }
    }
  }
}

# Example: Frontend Service
resource "kubernetes_service_v1" "frontend_service" {
  metadata {
    name = "frontend-service"
    namespace = kubernetes_namespace_v1.project_namespace.metadata[0].name
  }
  spec {
    selector = {
      app = "frontend"
    }
    port {
      port        = 80
      target_port = 80
    }
    type = "NodePort" # Use LoadBalancer or NodePort for K3s demo
  }
}

# ... Add similar blocks for all your other resources:
# backend-deployment, frontend-deployment, backend-service, mysql-service, etc.
# You will translate the logic from your YAML files into these resource blocks.
