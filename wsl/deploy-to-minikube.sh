#!/bin/bash

# Delete existing Minikube cluster
minikube delete

# Start Minikube
minikube start

# Create necessary directories
mkdir -p ~/studyshare/secrets
mkdir -p ~/studyshare/k8s/cluster
mkdir -p ~/studyshare/k8s/prometheus

# Create secret for images if it doesn't exist
cd ~/studyshare/secrets
kubectl create secret generic react-frontend-secret --from-env-file=.react.env --context=minikube
kubectl create secret generic node-backend-secret --from-env-file=.node.env --context=minikube
kubectl create secret generic flask-backend-secret --from-env-file=.flask.env --context=minikube

# Change to the Kubernetes cluster directory
cd ~/studyshare/k8s/cluster
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Update image tags
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:${IMAGE_TAG}|g" react-frontend-deployment.yaml
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:${IMAGE_TAG}|g" node-backend-deployment.yaml
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:${IMAGE_TAG}|g" flask-backend-deployment.yaml
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:${IMAGE_TAG}|g" celery-worker-deployment.yaml

# Apply and rollout
kubectl apply -f .
kubectl rollout status deployment/react-frontend-deployment --context=minikube
kubectl rollout status deployment/node-backend-deployment --context=minikube
kubectl rollout status deployment/flask-backend-deployment --context=minikube
kubectl rollout status deployment/celery-worker-deployment --context=minikube
kubectl rollout status deployment/redis-deployment --context=minikube

# Helm setup
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus and Grafana
helm upgrade --install prometheus-stack prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
helm upgrade --install grafana grafana/grafana --namespace monitoring

# Apply Prometheus config and get Grafana password
cd ~/studyshare/k8s/prometheus
kubectl apply -f .
echo "Grafana admin password:"
kubectl get secret --namespace monitoring prometheus-stack-grafana -o jsonpath='{.data.admin-password}' | base64 --decode

# Wait for Prometheus pod to be ready
kubectl wait --for=condition=Ready pod -l app.kubernetes.io/name=prometheus --namespace monitoring --timeout=120s

kubectl port-forward -n monitoring svc/prometheus-operated 9090:9090 &
kubectl port-forward service/prometheus-stack-grafana -n monitoring 3001:80 &

# Create network route
minikube tunnel &

# Access the React frontend
echo "React frontend is accessible at http://127.0.0.1:5173"