# E-Commerce Microservices Application (V1.01)

## Introduction
This project is a full-stack E-Commerce application designed with a microservices architecture. It features a robust **Spring Boot** backend for API management and business logic, coupled with a responsive **Next.js** frontend for the user interface. The system utilizes **MySQL** for data persistence and includes a complete monitoring stack using Prometheus, Loki, and Promtail.

### Tech Stack
* **Frontend:** Next.js (React), TypeScript, Tailwind CSS
* **Backend:** Java Spring Boot, Spring Security (JWT), Hibernate/JPA
* **Database:** MySQL
* **Infrastructure:** Kubernetes (K3s), Terraform, Docker
* **Monitoring:** Prometheus, Loki, Promtail

---

## Deployment Options

You can launch this project using **Terraform** (for a local Kubernetes environment on Ubuntu) or **Docker Compose** (for a containerized environment with monitoring).

### Option 1: Terraform with Local K3s (Ubuntu 22.04)

This method deploys the application into a local K3s Kubernetes cluster using Terraform. It enforces a strict boot order (MySQL -> Backend -> Frontend).

**Prerequisites:**
* Ubuntu 22.04
* Root/Sudo privileges

**Deployment Steps:**
Run the following commands sequentially in your terminal:

```bash
# 1. Clone the repository
git clone <YOUR_REPOSITORY_URL_HERE>

# 2. Navigate to the infrastructure directory
cd V1.01/k3s_and_terraform

# 3. Make the installer script executable and run it
# This script prepares Terraform and the K3s environment
chmod +x install_terraform.sh
sudo ./install_terraform.sh

# 4. Initialize Terraform providers
sudo terraform init

# 5. Create the execution plan
sudo terraform plan

# 6. Apply the configuration to deploy services
sudo terraform apply -auto-approve
```



### Option 2: Docker Compose (Full Stack + Monitoring)

This method launches the application containers alongside the monitoring stack (Prometheus, Loki, Promtail) using Docker.

**Prerequisites:**
* Docker Desktop or Docker Engine installed.

**Deployment Steps:**
Run the following command from the project root to start the application and the monitoring stack:

```bash
# Start the main application and the monitoring stack
docker compose up -d && docker compose -f ./monitoring/docker-compose.monitoring.yml up -d
