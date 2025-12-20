pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: lachlanevenson/k8s-kubectl
    command: ["cat"]
    tty: true
    env:
      - name: KUBECONFIG
        value: /kube/config
    volumeMounts:
      - name: kubeconfig-secret
        mountPath: /kube/config
        subPath: kubeconfig

  - name: dind
    image: docker:24-dind
    securityContext:
      privileged: true
    command:
      - dockerd
    args:
      - "--host=unix:///var/run/docker.sock"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    volumeMounts:
      - name: docker-sock
        mountPath: /var/run
      - name: docker-lib
        mountPath: /var/lib/docker

  volumes:
    - name: docker-sock
      emptyDir: {}
    - name: docker-lib
      emptyDir: {}
    - name: kubeconfig-secret
      secret:
        secretName: kubeconfig-secret
'''
        }
    }

    environment {
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        PROJECT_FOLDER = "2401125"
        NAMESPACE = "2401125"

        BACKEND_IMAGE = "${REGISTRY}/${PROJECT_FOLDER}/retrohub-backend"
        FRONTEND_IMAGE = "${REGISTRY}/${PROJECT_FOLDER}/retrohub-frontend"
        TAG = "v3"
    }

    stages {

        stage('Build Backend Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Waiting for Docker..."
                        sleep 10
                        docker info
                        docker build -t ${BACKEND_IMAGE}:${TAG} ./retrohub-backend
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        docker build \
                  --build-arg VITE_API_URL=http://2401125.imcc.com \
                  -t ${FRONTEND_IMAGE}:${TAG} \
                  ./retrohub-frontend
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401125-new', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401125_RetroHub \
                              -Dsonar.sources=retrohub-backend \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        echo "Changeme@2025" | docker login ${REGISTRY} -u admin --password-stdin
                    '''
                }
            }
        }

        stage('Push Images to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker push ${BACKEND_IMAGE}:${TAG}
                        docker push ${FRONTEND_IMAGE}:${TAG}
                    '''
                }
            }
        }

        stage('Create Namespace If Not Exists') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get ns ${NAMESPACE} || kubectl create namespace ${NAMESPACE}
                    '''
                }
            }
        }

        stage('Create ImagePullSecret If Not Exists') {
            steps {
                container('kubectl') {
                    sh '''
                        if ! kubectl get secret nexus-creds -n ${NAMESPACE}; then
                          kubectl create secret docker-registry nexus-creds \
                            --docker-server=${REGISTRY} \
                            --docker-username=admin \
                            --docker-password=Changeme@2025 \
                            -n ${NAMESPACE}
                        fi
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f k8s/backend-deployment.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/backend-service.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/frontend-deployment.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/frontend-service.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}
                    '''
                }
            }
        }

        stage('Rollout Status') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl rollout status deployment/retrohub-backend -n ${NAMESPACE}
                        kubectl rollout status deployment/retrohub-frontend -n ${NAMESPACE}
                    '''
                }
            }
        }
    }
}
