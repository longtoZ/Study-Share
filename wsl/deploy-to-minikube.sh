#!/bin/bash

# Start Minikube
minikube start

# Change to the Kubernetes cluster directory
cd ~/studyshare/k8s/cluster

# Check for manifest files
test -f react-frontend-deployment.yaml || { echo 'react-frontend-deployment.yaml missing'; exit 1; }
test -f node-backend-deployment.yaml || { echo 'node-backend-deployment.yaml missing'; exit 1; }
test -f flask-backend-deployment.yaml || { echo 'flask-backend-deployment.yaml missing'; exit 1; }
test -f celery-worker-deployment.yaml || { echo 'celery-worker-deployment.yaml missing'; exit 1; }

# Update image tags
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:${IMAGE_TAG}|g" react-frontend-deployment.yaml
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:${IMAGE_TAG}|g" node-backend-deployment.yaml
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:${IMAGE_TAG}|g" flask-backend-deployment.yaml
sed -i "s|image: ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:${IMAGE_TAG}|g" celery-worker-deployment.yaml

# Apply and rollout
kubectl apply -f .
kubectl rollout status deployment/react-frontend --context=minikube
kubectl rollout status deployment/node-backend --context=minikube
kubectl rollout status deployment/flask-backend --context=minikube
kubectl rollout status deployment/celery-worker --context=minikube
kubectl rollout status deployment/redis --context=minikube

# Helm setup
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus and Grafana
helm upgrade --install prometheus prometheus-community/prometheus --namespace monitoring --create-namespace
helm upgrade --install grafana grafana/grafana --namespace monitoring

# Apply Prometheus config and get Grafana password
cd ~/studyshare/k8s/prometheus
kubectl apply -f .
kubectl get secret --namespace monitoring grafana -o jsonpath='{.data.admin-password}' | base64 --decode
kubectl port-forward service/grafana 3001:80 -n monitoring