// Color functions for beautiful output
def success(message) { echo "\033[32m✅ ${message}\033[0m" }
def error(message) { echo "\033[31m❌ ${message}\033[0m" }
def warning(message) { echo "\033[33m⚠️ ${message}\033[0m" }
def info(message) { echo "\033[34mℹ️ ${message}\033[0m" }
def step(message) { echo "\033[36m🔵 ${message}\033[0m" }

pipeline {
    agent any

    options {
        // Build retention and timeout settings
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Skip default checkout if needed
        // skipDefaultCheckout()
    }

    environment {
        NODE_VERSION   = "20"
        VPS_HOST       = "31.192.106.220"
        VPS_USER       = "qtoxic"

        BACKEND_IMAGE = "backend"
        DOCKER_TAG     = "${env.BUILD_NUMBER}-${env.GIT_COMMIT[0..7]}"

        REMOTE_IMAGES  = "~/images"
        REMOTE_APP     = "~/training_journal_backend"
        REMOTE_DB      = "db/init"

        CONTEXT        = '.'
        GITHUB_REPO    = 'https://github.com/ech8tech/training_journal_backend.git'

        // Color codes for easy use
        GREEN   = '\033[32m'
        RED     = '\033[31m'
        YELLOW  = '\033[33m'
        BLUE    = '\033[34m'
        PURPLE  = '\033[35m'
        CYAN    = '\033[36m'
        RESET   = '\033[0m'
    }

    parameters {
        // For Multibranch Pipeline, parameters are optional
        // Branch is automatically determined by Jenkins
        // choice(
        //     name: 'DEPLOY_ENVIRONMENT',
        //     choices: ['staging', 'production'],
        //     description: 'Target deployment environment'
        // )
        booleanParam(
            name: 'INIT_DUMP',
            defaultValue: false,
            description: 'Инициализировать новый sql файл'
        )
        booleanParam(
            name: 'RUN_MIGRATIONS',
            defaultValue: false,
            description: 'Запустить миграции'
        )
        booleanParam(
            name: 'REVERT_LAST_MIGRATION',
            defaultValue: false,
            description: 'Отменить последнюю миграцию'
        )
    }

    stages {
        stage('Information') {
            steps {
                script {
                    info("Starting build for commit: ${env.GIT_COMMIT}")
                    info("Current branch: ${env.BRANCH_NAME}")
                    info("Build number: ${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Build & Package') {
            steps {
                script {
                    sh """#!/usr/bin/env bash
                        set -Eeuo pipefail

                        echo -e "${BLUE}🛠️ Create buildx builder if it doesn't exist...${RESET}"
                        docker buildx create --name jx --use || docker buildx use jx
                        docker buildx inspect --bootstrap

                        echo -e "${BLUE}🛠️ Build with proper tagging...${RESET}"
                        DOCKER_BUILDKIT=1 docker buildx build \
                            --platform linux/amd64 \
                            --pull \
                            -t ${BACKEND_IMAGE}:${DOCKER_TAG} \
                            -t ${BACKEND_IMAGE}:latest \
                            --load \
                            -f ${CONTEXT}/Dockerfile \
                            ${CONTEXT}

                        echo -e "${BLUE}💾 Save image for deployment...${RESET}"
                        docker save ${BACKEND_IMAGE}:${DOCKER_TAG} | gzip > ${BACKEND_IMAGE}-${DOCKER_TAG}.tar.gz

                        echo -e "${BLUE}✅ Verify build...${RESET}"
                        docker images | grep ${BACKEND_IMAGE}
                        ls -lah *.tar.gz
                    """
                }
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    expression { env.BRANCH_NAME == 'main' }
                    expression { env.BRANCH_NAME == 'develop' }
                    expression { env.BRANCH_NAME == 'feature' }
                }
            }
            steps {
                script {
                    sshagent(credentials: ['vps-ssh-key']) {
                        configFileProvider([
                            configFile(fileId: 'backend-sql-file', variable: 'DB_DUMP_FILE')
                        ]) {
                            withCredentials([
                                file(credentialsId: 'backend-secret-file', variable: 'DOTENV_FILE')
                            ]) {
                                withEnv([
                                    "IS_INIT_DUMP=${params.INIT_DUMP ?: 'false'}",
                                    "IS_RUN_MIGRATIONS=${params.RUN_MIGRATIONS ?: 'false'}",
                                    "IS_REVERT_LAST_MIGRATION=${params.REVERT_LAST_MIGRATION ?: 'false'}"
                                ]) {
                                    sh '''#!/usr/bin/env bash
                                        set -Eeuo pipefail

                                        # Configuration
                                        HOST="${VPS_HOST}"
                                        USER="${VPS_USER}"
                                        IMAGE_FILE="${BACKEND_IMAGE}-${DOCKER_TAG}.tar.gz"
                                        DOCKER_PROD_FILE="docker-compose.prod.yml"

                                        echo -e "${BLUE}🚀 Starting deployment process...${RESET}"
                                        echo -e "${BLUE}🎯 Target: ${USER}@${HOST} ${RESET}"
                                        echo -e "${BLUE}🎞️ Image: ${IMAGE_FILE} ${RESET}"

                                        echo "LOCAL:"; whoami; pwd; id
                                        echo "REMOTE:"; ssh -o StrictHostKeyChecking=no qtoxic@31.192.106.220 'whoami; pwd; id'

                                        echo -e "${BLUE}🗄️ Prepared remote directories and files...${RESET}"
                                        ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 "$USER@$HOST" "
                                            mkdir -p ${REMOTE_IMAGES} ${REMOTE_APP} ${REMOTE_APP}/${REMOTE_DB}
                                        "

                                        echo -e "${BLUE}🗄️ Fixing permissions for files...${RESET}"
                                        # Изменяем права на удаленном сервере, если файлы уже существуют
                                        ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 "$USER@$HOST" "
                                            if [ -f ${REMOTE_APP}/.env.production ]; then
                                                chmod u+w ${REMOTE_APP}/.env.production
                                            fi
                                            if [ -f ${REMOTE_APP}/${REMOTE_DB}/dump.sql ]; then
                                                chmod u+w ${REMOTE_APP}/${REMOTE_DB}/dump.sql
                                            fi
                                        "

                                        scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 "$DOTENV_FILE" "$USER@$HOST:${REMOTE_APP}/.env.production"
                                        # scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 "$DB_DUMP_FILE" "$USER@$HOST:${REMOTE_APP}/${REMOTE_DB}/dump.sql"

                                        echo -e "${BLUE}🗄️ Copying image file...${RESET}"
                                        scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 "./$IMAGE_FILE" "$USER@$HOST:${REMOTE_IMAGES}/"

                                        echo -e "${BLUE}🗄️ Copying deployment files...${RESET}"
                                        scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 "./$DOCKER_PROD_FILE" "$USER@$HOST:${REMOTE_APP}/"

                                        echo -e "${BLUE}🗄️ Copying sql dump file...${RESET}"
                                        scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 "$DB_DUMP_FILE" "$USER@$HOST:${REMOTE_APP}/${REMOTE_DB}/dump.sql"

                                        # Deploy
                                        ssh -o StrictHostKeyChecking=no "$USER@$HOST" "bash -lc '
                                            set -Eeuo pipefail

                                            echo -e "${BLUE}🫗 Loading Docker image...${RESET}"
                                            docker load -i \"$REMOTE_IMAGES/$IMAGE_FILE\"

                                            cd ${REMOTE_APP}
                                            echo -e "${BLUE}⚙️ Stopping existing services...${RESET}"
                                            DOCKER_TAG=${DOCKER_TAG} docker compose -f docker-compose.prod.yml down || true

                                            if [ "${IS_INIT_DUMP}" == "true" ]; then
                                                chmod 644 ${REMOTE_APP}/${REMOTE_DB}/dump.sql
                                                echo -e "${BLUE}🗑️ Removing old volumes for fresh database initialization...${RESET}"
                                                DOCKER_TAG=${DOCKER_TAG} docker compose -f docker-compose.prod.yml down --volumes --remove-orphans
                                            fi

                                            echo -e "${BLUE}✈️ Starting services with DOCKER_TAG=${DOCKER_TAG}...${RESET}"
                                            DOCKER_TAG=${DOCKER_TAG} docker compose -f docker-compose.prod.yml up -d

                                            if [ "${IS_RUN_MIGRATIONS}" == "true" ]; then
                                                echo -e "${BLUE}⚙️Run migrations...${RESET}"
                                                docker exec ${BACKEND_IMAGE} npm run migration:run
                                                echo -e "${GREEN}✅Migrations successed!${RESET}"
                                                docker exec ${BACKEND_IMAGE} npm run migration:show
                                            fi

                                            if [ "${IS_REVERT_LAST_MIGRATION}" == "true" ]; then
                                                echo -e "${BLUE}⚙️Revert last migration...${RESET}"
                                                docker exec ${BACKEND_IMAGE} npm run migration:revert
                                                echo -e "${GREEN}✅Revert last migration successed!${RESET}"
                                                docker exec ${BACKEND_IMAGE} npm run migration:show
                                            fi

                                            echo -e "${BLUE}✅ Verifying deployment...${RESET}"
                                            sleep 10
                                            docker compose -f docker-compose.prod.yml ps
                                            echo -e "${GREEN}✅ Deployment completed successfully!${RESET}"
                                        '"
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    info("🧹 Clean up Docker images and containers...")
                    sh '''
                        docker image prune -f || true
                        docker container prune -f || true
                    '''

                    info("🧹 Clean up build artifacts...")
                    sh '''
                        rm -f *.tar.gz || true
                    '''

                    // Clean up remote server (only if deployment was successful)
                    info("🧹 Clean up remote server...")
                    sshagent(credentials: ['vps-ssh-key']) {
                        sh '''#!/usr/bin/env bash
                            set -Eeuo pipefail

                            HOST="${VPS_HOST}"
                            USER="${VPS_USER}"
                            IMAGE_FILE="${BACKEND_IMAGE}-${DOCKER_TAG}.tar.gz"
                            IMAGE_NAME="${BACKEND_IMAGE}:${DOCKER_TAG}"

                            echo -e "${BLUE}🗑️ Removing images from remote server...${RESET}"
                            ssh -o StrictHostKeyChecking=no "$USER@$HOST" "bash -lc '
                                # Remove current archive
                                rm -f ${REMOTE_IMAGES}/$IMAGE_FILE || true

                                docker images --format "{{.Repository}}:{{.Tag}}" | grep "backend:" | grep -v $IMAGE_NAME | xargs -r docker rmi

                                echo -e "${GREEN}✅ Remote cleanup completed successfully...${RESET}"
                            '"
                        '''
                    }

                    success("Clean up completed successfully!")
                }
            }
        }
    }

    post {
        always {
            script {
                success("Pipeline execution completed!")

                // Archive artifacts
                archiveArtifacts artifacts: '*.tar.gz', allowEmptyArchive: true

                // Clean workspace
                cleanWs()
            }
        }
        success {
            script {
                success("Pipeline succeeded!")

                // Send success notification
                def message = """
                    ✅ Pipeline SUCCESS
                    Branch: ${env.BRANCH_NAME}
                    Build: ${env.BUILD_NUMBER}
                    Commit: ${env.GIT_COMMIT[0..7]}
                """

                echo message
            }
        }
        failure {
            script {
                error("Pipeline failed!")

                // Send failure notification
                def message = """
                    ❌ Pipeline FAILED
                    Branch: ${env.BRANCH_NAME}
                    Build: ${env.BUILD_NUMBER}
                    Commit: ${env.GIT_COMMIT[0..7]}
                """

                echo message
            }
        }
        unstable {
            script {
                warning("Pipeline completed with warnings!")

                def message = """
                    ⚠️ Pipeline UNSTABLE
                    Branch: ${env.BRANCH_NAME}
                    Build: ${env.BUILD_NUMBER}
                    Commit: ${env.GIT_COMMIT[0..7]}
                """

                echo message
            }
        }
        aborted {
            script {
                error("Pipeline was aborted!")
            }
        }
    }
}
