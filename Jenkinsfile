
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Getting To-Do project source code'
            }
        }

        stage('Build') {
            steps {
                dir('backend') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build Successful') {
            steps {
                echo 'To-Do backend built successfully!'
            }
        }
    }
}
