terraform {
  required_providers {
    null = {
      source = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

provider "null" {}

resource "null_resource" "setup_k3s_and_deploy" {
  # Force re-run when code changes (optional)
  triggers = {
    always_run = timestamp()
  }

  connection {
    type        = "ssh"
    host        = var.vm_ip
    user        = var.ssh_user
    private_key = var.ssh_private_key
  }

  provisioner "remote-exec" {
    inline = [
      # update and install dependencies
      "sudo apt-get update -y",
      "sudo apt-get install -y docker.io git curl",

      # enable docker
      "sudo systemctl enable --now docker",

      # install k3s (kubernetes lightweight). make kubeconfig world readable for remote apply
      "curl -sfL https://get.k3s.io | sudo INSTALL_K3S_EXEC='--write-kubeconfig-mode=644' sh -",

      # wait until k3s is ready
      "sudo /usr/local/bin/kubectl get nodes --no-headers || true",
      "sleep 8",

      # clone the repo (if not already present) - adjust URL or copy files beforehand
      "if [ ! -d ~/app ]; then git clone https://github.com/yourusername/your-repo.git ~/app || true; fi",
      "cd ~/app || true",

      # login to dockerhub (uses credentials passed from terraform variables)
      # NOTE: this will show up in Terraform logs. If you prefer, push images manually instead.
      "echo ${var.dockerhub_password} | sudo docker login -u ${var.dockerhub_username} --password-stdin",

      # build backend and frontend images (adjust paths if necessary)
      "cd ~/app/Backend || true; sudo docker build -t ${var.dockerhub_username}/backend:latest . || true",
      "cd ~/app/FrontEnd || true; sudo docker build -t ${var.dockerhub_username}/frontend:latest . || true",

      # push images to Docker Hub
      "sudo docker push ${var.dockerhub_username}/backend:latest || true",
      "sudo docker push ${var.dockerhub_username}/frontend:latest || true",

      # create a folder for k8s manifests and write manifests if not present (optional)
      "mkdir -p ~/app/k8s || true",
      "cat > ~/app/k8s/00-deployments-and-services.yaml <<'EOF'\n<PLACEHOLDER_K8S_MANIFESTS>\nEOF",
      # apply k8s manifests
      "sudo /usr/local/bin/kubectl apply -f ~/app/k8s/00-deployments-and-services.yaml"
    ]
  }
}
