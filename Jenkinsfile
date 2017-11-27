pipeline {
    agent any

    tools {nodejs "Node920"}

    stages {
        stage('Checkout') {
            steps {
                echo "Current Branch is ${env.BRANCH_NAME}"
                checkout scm
                sh 'git status'
            }
        }
        stage('Install dependencies'){
            steps {
                sh 'npm install'
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm run deploy:stage'
            }
        }
    }
}
