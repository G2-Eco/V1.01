terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
  required_version = ">= 1.0.0"
}



provider "null" {}

# Install MicroK8s on the remote host
resource "null_resource" "install_microk8s" {
  provisioner "remote-exec" {
    inline = [
      # Install MicroK8s
      "sudo snap install microk8s --classic",
      "sudo chown -f -R akai:akai /home/akai/.kube", # <-- ADDED
      "sudo usermod -a -G microk8s akai",           # <-- ADDED

      # Add current SSH user to microk8s group
      "sudo usermod -a -G microk8s ${var.ssh_user} || true",

      # Fix kube config permissions
      "sudo mkdir -p /home/${var.ssh_user}/.kube",
      "sudo microk8s config > /home/${var.ssh_user}/.kube/config",
      "sudo chown -R ${var.ssh_user}:${var.ssh_user} /home/${var.ssh_user}/.kube",

      # Enable DNS/ingress/addons
      "sudo microk8s enable dns",
      "sudo microk8s enable storage",
      "sudo microk8s enable ingress",
    ]

    connection {
      type        = "ssh"
      host        = var.ssh_host
      user        = var.ssh_user
      password = var.ssh_password
      #private_key = file(var.ssh_private_key_path)
    }
  }
}


# Deploy Kubernetes resources by running kubectl on the remote (microk8s.kubectl)
resource "null_resource" "deploy_k8s_manifests" {
  depends_on = [null_resource.install_microk8s]

  provisioner "local-exec" {
    # This will pipe the YAML into an ssh remote command that runs `sudo microk8s kubectl apply -f -`
    # It requires that your local machine can ssh to the remote using the same private key.
    command = <<EOT
cat <<'YAMLS' | ssh -o StrictHostKeyChecking=no -i ${var.ssh_private_key_path} ${var.ssh_user}@${var.ssh_host} "sudo microk8s kubectl apply -f -"
---
# MySQL Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: amvdown/ecom-database:latest
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "root"
        - name: MYSQL_DATABASE
          value: "ecom"
        - name: MYSQL_USER
          value: "user"
        - name: MYSQL_PASSWORD
          value: "password"
        ports:
        - containerPort: 3306
        readinessProbe:
          exec:
            command:
            - sh
            - -c
            - "mysqladmin ping -h 127.0.0.1 -uroot -proot"
          initialDelaySeconds: 5
          periodSeconds: 5
      # ephemeral storage (not persisted)
      restartPolicy: Always
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
  type: ClusterIP
---
# Backend Deployment (Spring Boot)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: amvdown/ecom-backend:latest
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:mysql://mysql:3306/ecom?useSSL=false&allowPublicKeyRetrieval=true"
        - name: SPRING_DATASOURCE_USERNAME
          value: "user"
        - name: SPRING_DATASOURCE_PASSWORD
          value: "password"
        - name: SPRING_JPA_HIBERNATE_DDL_AUTO
          value: "update"
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
---
# Frontend Deployment (Next.js as Node server)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: amvdown/ecom-frontend:latest
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://backend:8080/api/v1"
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30000
  type: NodePort
YAMLS
EOT
  }
}
