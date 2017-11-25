pipeline {
    agent any

    tools {nodejs "Node920"}

    stages {
        stage('Checkout') {
            steps {
                echo "Current Branch is ${env.BRANCH_NAME}"
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/pluto-net/web-client']]])
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
