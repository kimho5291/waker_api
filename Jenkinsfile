pipeline {
  environment {
      // 개발 AWS에 생성한 컨슈머용 ECR 주소
      registry = '8xxxxxxxxxxx0.dkr.ecr.ap-northeast-2.amazonaws.com'  
      // Jenkins에 셋팅한 AWS용 Credential ID
      registryCredential = 'waker-aws-credential' 
      sshTarget = 'waker-api-ssh-credential'
      app = ''
  }

  agent any

  stages {

    stage('Clone repo'){
      steps{
        checkout scm
      }
    }
    stage('Docker Build') {
      steps {
        script {
          app = docker.build(registry+"/waker")
        }
      }
    }
    stage('ECR Push') {
      steps {
        script {
          sh 'rm  ~/.dockercfg || true'
          sh 'rm ~/.docker/config.json || true'
          docker.withRegistry('https://'+registry, 'ecr:ap-northeast-2:'+registryCredential) {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
          }
        }
      }
    }
    stage('ssh-deploy'){
      steps{
        sshagent (credentials: [sshTarget]){
          sh """
            ssh -o StrictHostKeyChecking=no ubuntu@10.10.201.52 '
            aws ecr get-login-password --region ap-northeast-2 | sudo docker login --username AWS --password-stdin 8xxxxxxxxxx0.dkr.ecr.ap-northeast-2.amazonaws.com
            sudo docker stop waker_ssl
            sudo docker rm waker_ssl
            sudo docker rmi 8xxxxxxxxxx0.dkr.ecr.ap-northeast-2.amazonaws.com/waker
            sudo docker pull 8xxxxxxxxxx0.dkr.ecr.ap-northeast-2.amazonaws.com/waker:latest
            sudo docker-compose up -d
            '
          """
        }
      }
    }

  }
}