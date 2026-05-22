pipeline {
    agent any

    environment {
        APP_NAME = 'campus-lost-found-api'
        TEST_CONTAINER = 'campus-lost-found-api-test'
        APP_PORT = '3000'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies and building Docker image...'
                bat 'npm.cmd ci'
                bat 'npm.cmd run build'
                bat 'docker build -t %APP_NAME%:%BUILD_NUMBER% .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated API tests...'
                bat 'npm.cmd test'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running ESLint code quality checks...'
                bat 'npm.cmd run lint'
            }
        }

        stage('Security') {
            steps {
                echo 'Scanning dependencies for high severity vulnerabilities...'
                bat 'npm.cmd audit --audit-level=high'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application to Docker test environment...'
                bat 'docker stop %TEST_CONTAINER% || exit /b 0'
                bat 'docker rm %TEST_CONTAINER% || exit /b 0'
                bat 'docker run -d -p %APP_PORT%:3000 --name %TEST_CONTAINER% %APP_NAME%:%BUILD_NUMBER%'
                bat 'ping 127.0.0.1 -n 6 > nul'
                bat 'curl.exe -f http://localhost:%APP_PORT%/health'
            }
        }

        stage('Release') {
            steps {
                echo 'Creating versioned release image...'
                bat 'docker tag %APP_NAME%:%BUILD_NUMBER% %APP_NAME%:release-%BUILD_NUMBER%'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking health and metrics endpoints...'
                bat 'curl.exe -f http://localhost:%APP_PORT%/health'
                bat 'curl.exe -f http://localhost:%APP_PORT%/metrics'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully. Build, test, quality, security, deploy, release, and monitoring all passed.'
        }

        failure {
            echo 'Pipeline failed. Please check the Jenkins console output.'
        }
    }
}