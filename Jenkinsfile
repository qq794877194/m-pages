Jenkinsfile (Declarative Pipeline)
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                bat 'echo test was fail; exit 1'
            }
        }
    }
    post {
        always {
            echo 'this will always run'
        }
        success {
            echo 'this will run only if successful'
        }
        failure {
            echo 'this will run only if failed'
        }
        unstable {
            echo 'this will run only if the run was marked as unstable'
        }
        changed {
            echo 'this will run only if the state of the pipeline has changed'
            echo 'for example, if the pipeline was previously failing but is now successful'
        }

    }
}