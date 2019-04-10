pipeline {
    agent any

    tools {nodejs "Node810"}

    options {
        disableConcurrentBuilds() 
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
                            sh 'npm run deploy:prod'
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
                    def targetUrl
                    def deployedCommits = ""
                    if (env.BRANCH_NAME == 'master') {
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'GITHUB_HTTPS_CREDENTIALS', usernameVariable: 'GIT_AUTHOR_NAME', passwordVariable: 'GIT_PASSWORD']]) {
                            sh 'git fetch --tags'
                            deployedCommits = sh (
                                script: 'git log --oneline --pretty=format:"%cd(%cr)] <https://github.com/pluto-net/scinapse-web-client/commit/%H|%s> - (By %an)" production..HEAD',
                                returnStdout: true
                            ).trim()
                            sh 'git config --global user.email "dev@pluto.netwrok"'
                            sh 'git config --global user.name "Jenkins"'
                            sh 'git config --global push.default simple'
                            sh 'git tag production -f'
                            sh('git push https://${GIT_AUTHOR_NAME}:${GIT_PASSWORD}@github.com/pluto-net/scinapse-web-client.git --tags -f')
                        } 
                        env.WORKSPACE = pwd()
                        def version = readFile "${env.WORKSPACE}/version"
                        slackSend color: 'good', channel: "#ci-build", message: "Build DONE! Finish to production deploy version: ${version}"
                        slackSend color: 'good', channel: "#front-end-prod-deploy", message: deployedCommits
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
