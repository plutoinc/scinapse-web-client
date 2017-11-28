pipeline {
    agent any

    tools {nodejs "Node920"}

    stages {
        stage('Checkout') {
            steps {
                slackSend color: 'good', channel: "#ci-build", message: "Build Started: ${env.JOB_NAME}"
                checkout scm
                sh 'git status'
            }
        }
        stage('Install dependencies'){
            steps {
                script {
                    try {
                        sh 'npm install'
                    } catch (err) {
                        slackSend color: "danger", channel: "#ci-build", failOnError: true, message: "Build Failed at NPM INSTALL: ${env.JOB_NAME}"
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        sh 'npm run deploy:stage'
                    } catch (err) {
                        slackSend color: "danger", failOnError: true, message: "Build Failed at BUILD & DEPLOY: ${env.JOB_NAME}"
                    }
                    slackSend color: 'good', channel: "#ci-build", message: "Build DONE! ${env.JOB_NAME} please check https://poc-stage.pluto.network"
                }
            }
        }
    }
}
