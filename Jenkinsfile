pipeline {
    agent any
    
    environment {
        WSL_USERNAME = 'longto'
        WSL_HOST = credentials('wsl-host-ip')  // Use Jenkins secret
        IMAGE_TAG = 'v2.0.0'
        DOCKER_REGISTRY = 'longtoz'
        APP_NAME = 'studyshare'
        DOCKER_HUB_CREDS = credentials('dockerhub-credentials')  // Simplify credentials
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Use bat for Windows; run git in WSL if needed
                    env.GIT_COMMIT_SHORT = bat(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Use bat for Windows Docker commands
                    bat """
                        docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:${IMAGE_TAG} ./frontend
                        docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:${IMAGE_TAG} ./backend/node
                        docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:${IMAGE_TAG} ./backend/flask
                        docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:${IMAGE_TAG} ./backend/flask
                    """
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    script {
                        bat """
                            echo %DOCKER_HUB_PASSWORD% | docker login -u %DOCKER_HUB_USERNAME% --password-stdin
                            docker push ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:${IMAGE_TAG}
                        """
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                sshagent(['wsl-ssh-creds']) {
                    script {
                        bat """
                            ssh -o StrictHostKeyChecking=no ${WSL_USERNAME}@${WSL_HOST} ^
                            "bash -c ^"
                                # Ensure Minikube is running
                                minikube status | grep -q 'host: Running' || minikube start && ^
                                # Navigate to repo in WSL (adjust path if needed)
                                cd ~/studyshare/k8s/cluster && ^
                                # Validate files exist
                                test -f react-frontend-deployment.yaml || { echo 'react-frontend-deployment.yaml missing'; exit 1; } && ^
                                test -f node-backend-deployment.yaml || { echo 'node-backend-deployment.yaml missing'; exit 1; } && ^
                                test -f flask-backend-deployment.yaml || { echo 'flask-backend-deployment.yaml missing'; exit 1; } && ^
                                test -f celery-worker-deployment.yaml || { echo 'celery-worker-deployment.yaml missing'; exit 1; } && ^
                                # Update image tags
                                sed -i 's|image: ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:${IMAGE_TAG}|g' react-frontend-deployment.yaml && ^
                                sed -i 's|image: ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:${IMAGE_TAG}|g' node-backend-deployment.yaml && ^
                                sed -i 's|image: ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:${IMAGE_TAG}|g' flask-backend-deployment.yaml && ^
                                sed -i 's|image: ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:.*|image: ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:${IMAGE_TAG}|g' celery-worker-deployment.yaml && ^
                                # Apply manifests
                                kubectl apply -f . && ^
                                # Wait for deployments
                                kubectl rollout status deployment/react-frontend --context=minikube && ^
                                kubectl rollout status deployment/node-backend --context=minikube && ^
                                kubectl rollout status deployment/flask-backend --context=minikube && ^
                                kubectl rollout status deployment/celery-worker --context=minikube && ^
                                kubectl rollout status deployment/redis --context=minikube && ^
                                # Helm: Use upgrade --install for idempotency
                                helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && ^
                                helm repo add grafana https://grafana.github.io/helm-charts && ^
                                helm repo update && ^
                                helm upgrade --install prometheus prometheus-community/prometheus --namespace monitoring --create-namespace && ^
                                helm upgrade --install grafana grafana/grafana --namespace monitoring && ^
                                # Apply Prometheus configs
                                cd ~/studyshare/k8s/prometheus && ^
                                kubectl apply -f . && ^
                                # Get Grafana password (output to Jenkins console)
                                kubectl get secret --namespace monitoring grafana -o jsonpath='{.data.admin-password}' | base64 --decode && ^
                                # Start port-forward in background (optional: may need manual access)
                                kubectl port-forward service/grafana 3001:80 -n monitoring &
                            ^"
                        """
                    }
                }
            }
        }

        stage('Get App URL') {
            steps {
                sshagent(['wsl-ssh-creds']) {
                    script {
                        bat """
                            ssh -o StrictHostKeyChecking=no ${WSL_USERNAME}@${WSL_HOST} ^
                            "bash -c ^"
                                minikube service frontend-service --url
                            ^"
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace'
            cleanWs()
        }
        failure {
            echo 'Build failed!'
        }
    }
}