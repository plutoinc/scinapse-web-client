pipeline {
    agent any

    tools {nodejs "Node810"}

    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    }

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
                        if (env.BRANCH_NAME == 'master') {
                            sh 'npm run build:prod'
                        } else {
                            sh "BRANCH_NAME=${env.BRANCH_NAME} npm run deploy:dev"
                        }
                    } catch (err) {
                        slackSend color: "danger", failOnError: true, message: "Build Failed at BUILD & DEPLOY: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }

        stage('Notify') {
            steps {
                script {
                    def targetUrl;
                    if (env.BRANCH_NAME == 'master') {
                        targetUrl = "https://scinapse.io"

                        env.WORKSPACE = pwd()
                        def version = readFile "${env.WORKSPACE}/version"
                        slackSend color: 'good', channel: "#ci-build", message: "Build DONE! ${version} version will be deployed to production soon!!"

                        build(job: "scinapse-web-client-prod-deploy/master", parameters: [string(name: 'version', value: version)], wait: false)
                    } else {
                        targetUrl = "https://dev.scinapse.io?branch=${env.BRANCH_NAME}"
                        slackSend color: 'good', channel: "#ci-build", message: "Build DONE! ${env.BRANCH_NAME} please check ${targetUrl}"
                    }

                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
