pipeline {
    agent any
    
    environment {
        WSL_USERNAME = 'longto'
        IMAGE_TAG = 'v2.0.1'
        DOCKER_REGISTRY = 'longtoz'
        APP_NAME = 'studyshare'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = bat(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat """
                    docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-react-frontend:${IMAGE_TAG} ./frontend
                    docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-node-backend:${IMAGE_TAG} ./backend/node
                    docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-flask-backend:${IMAGE_TAG} ./backend/flask
                    docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-celery-worker:${IMAGE_TAG} ./backend/flask
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
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

        stage('Deploy to Minikube') {
            steps {
                withCredentials([string(credentialsId: 'wsl-host-ip', variable: 'WSL_HOST')]) {
                    sshagent(['wsl-ssh-creds']) {
                        bat """
                            scp -o StrictHostKeyChecking=no ./frontend/.env ${WSL_USERNAME}@${WSL_HOST}:~/studyshare/secrets/.react.env
                            scp -o StrictHostKeyChecking=no ./backend/node/.env ${WSL_USERNAME}@${WSL_HOST}:~/studyshare/secrets/.node.env
                            scp -o StrictHostKeyChecking=no ./backend/flask/.env ${WSL_USERNAME}@${WSL_HOST}:~/studyshare/secrets/.flask.env
                            scp -r -o StrictHostKeyChecking=no ./k8s ${WSL_USERNAME}@${WSL_HOST}:~/studyshare/
                            scp -o StrictHostKeyChecking=no ./wsl/deploy-to-minikube.sh ${WSL_USERNAME}@${WSL_HOST}:~/studyshare/wsl/deploy-to-minikube.sh
                            ssh -o StrictHostKeyChecking=no ${WSL_USERNAME}@${WSL_HOST} "sed -i 's/\\r//g' ~/studyshare/wsl/deploy-to-minikube.sh"
                            ssh -o StrictHostKeyChecking=no ${WSL_USERNAME}@${WSL_HOST} "bash ~/studyshare/wsl/deploy-to-minikube.sh"
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