pipeline {
    agent any

    tools {nodejs "Node810"}

    stages {
        stage('Checkout') {
            steps {
                slackSend color: 'good', channel: "#ci-build", message: "scinapse-web-client Build Started: ${env.BRANCH_NAME}"
                checkout scm
                sh 'git status'
            }
        }

        stage('clean artifacts'){
            steps {
                script {
                    sh 'rm -rf output'
                    sh 'rm -rf node_modules'
                    sh 'npm cache clean -f'
                }
            }
        }

        stage('Install dependencies'){
            steps {
                script {
                    try {
                        sh 'npm --version'
                        sh 'npm ci'
                    } catch (err) {
                        slackSend color: "danger", channel: "#ci-build", failOnError: true, message: "Build Failed at NPM INSTAL: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }
        stage('Unit Test'){
            steps {
                script {
                    try {
                        sh 'npm test'
                    } catch (err) {
                        slackSend color: "danger", channel: "#ci-build", failOnError: true, message: "Build Failed at Unit Test step: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        if (env.BRANCH_NAME == 'release') {
                            sh 'npm run deploy:prod'
                        } else {
                            sh "BRANCH_NAME=${env.BRANCH_NAME} npm run deploy:stage"
                        }
                    } catch (err) {
                        slackSend color: "danger", failOnError: true, message: "Build Failed at BUILD & DEPLOY: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }
        stage('E2E test') {
            steps {
                script {
                    try {
                        if (env.BRANCH_NAME == 'release') {
                            sh 'NODE_ENV=production npm run test:e2e'
                        } else {
                            sh "NODE_ENV=stage BRANCH_NAME=${env.BRANCH_NAME} npm run test:e2e"
                        }
                    } catch (err) {
                        slackSend color: "danger", failOnError: true, message: "Build Failed at BUILD & DEPLOY: ${env.BRANCH_NAME}"
                        throw err
                    } finally {
                        archiveArtifacts artifacts: 'output/**'
                    }
                    def targetUrl;
                    if (env.BRANCH_NAME == 'release') {
                        targetUrl = "https://scinapse.io"
                    } else {
                        targetUrl = "https://stage.scinapse.io?branch=${env.BRANCH_NAME}"
                    }
                    slackSend color: 'good', channel: "#ci-build", message: "Build DONE! ${env.BRANCH_NAME} please check ${targetUrl}"

                }
            }
        }
    }

    post {
        always {
            deleteDir() /* clean up our workspace */
        }
    }
}
