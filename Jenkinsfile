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
                            ssh -o StrictHostKeyChecking=no ${WSL_USERNAME}@${WSL_HOST} "bash ~/wsl/deploy-to-minikube.sh"
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
                            ssh -o StrictHostKeyChecking=no ${WSL_USERNAME}@${WSL_HOST} "bash ~/wsl/get-app-url.sh"
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