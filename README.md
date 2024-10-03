
# Waker
<p align="center">
  <img src="https://github.com/user-attachments/assets/d34d8252-bd35-4d80-a0b7-b276596b8721" width="200" alt="Waker Logo" />
</p>

<p align="center">애인, 가족, 최애 등의 목소리로 대화하며 일어나는 대화형 어플</p>
<p align="center">
  FE: <img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white"/>
  BE: <img src="https://img.shields.io/badge/nestjs-123?style=for-the-badge&logo=nestjs&logoColor=%23E0234E"/>
  AI Model: 
  <a href="https://github.com/FunAudioLLM/CosyVoice"> 
    <img alt="Static Badge" src="https://img.shields.io/badge/CozyVoice-123?style=for-the-badge&color=%23ECD53F"/>
  </a>
</p>

## 프로젝트 소개
- Waker는 애인, 가족, 최애 등읠 목소리로 대화하며 일어나는 대화형 어플을 제작하는 프로젝트입니다.
- 음성 학습을 하여 원하는 대상의 목소리를 cloning할 수 있습니다.
- 알람을 통해서 정보(기상, 날씨) 제공을 해줍니다.
- 사용자간 음성파일을 공유하여 사용할 수 있습니다.
### waker-api
- Waker-api는 waker 어플리케이션에서 사용하는 백엔드 API 서버입니다.
- 클라우드 인프라를 AWS를 통해서 구축하였습니다.
- [CI/CD] Jenkins를 활용하여 배포가 가능합니다.
- 기상(가상청 공공 데이터), 뉴스(딥서치 뉴스 API) 정보를 가져와 사용합니다.
- 개발 기간: 24.06 ~ 24.10(총 4개월)
- 개발 API 문서 : <a href="https://api.vvaker.com/api">링크</a>

### Tech Stack
<p align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/typescript-123?style=for-the-badge&logo=typescript&logoColor=%233178C6">
  <img alt="Static Badge" src="https://img.shields.io/badge/nestjs-123?style=for-the-badge&logo=nestjs&logoColor=%23E0234E">
  <img alt="Static Badge" src="https://img.shields.io/badge/mysql-123?style=for-the-badge&logo=mysql&logoColor=%234479A1">
  <img alt="Static Badge" src="https://img.shields.io/badge/redis-123?style=for-the-badge&logo=redis&logoColor=%23FF4438">
  <img alt="Static Badge" src="https://img.shields.io/badge/git-123?style=for-the-badge&logo=git&logoColor=%23F05032">
  <img alt="Static Badge" src="https://img.shields.io/badge/jenkins-123?style=for-the-badge&logo=jenkins&logoColor=%23D24939">
  <img alt="Static Badge" src="https://img.shields.io/badge/amazonec2-123?style=for-the-badge&logo=amazonec2&logoColor=%23FF9900">
  <img alt="Static Badge" src="https://img.shields.io/badge/amazons3-123?style=for-the-badge&logo=amazons3&logoColor=%23569A31">
  <img alt="Static Badge" src="https://img.shields.io/badge/docker-123?style=for-the-badge&logo=docker&logoColor=%232496ED">
</p>

## 프로젝트 기여
1. UX/UI 디자인
2. 클라우드 인프라 구성
3. 서버 설계 및 구현

## UX/UI 디자인
- 깔끔하고 최신 트랜드를 따라가고자 목표를 잡았으며, 토끼의 캐릭터를 마스코트로 잡아 귀여움을 더했습니다. 
- 디자인: <a href="https://www.figma.com/design/al2sXFT1PyxuZOE3mhgBy9/waker_hi-fi?node-id=0-1&t=eGh9JdMahgkOUPZb-1">Figma<a>

![image](https://github.com/user-attachments/assets/b448347a-036b-40f2-a82c-c857cdb4750b)

## 클라우드 인프라 설계
- AWS를 사용하여 클라우드 인프라 설계
- 음성 파일을 저장하기 위해 S3를 사용하였으며, 보안 및 다운로드 속도 개선을 위한 CDN 도입
- Route53 + ALB + Certification = HTTPS 적용
- 가용성을 위해서 AZ을 두개로 설정하였습니다.
- 향후 배포가 되면 bastion host를 public subnet에 위치시켜 보안성을 높힐 예정입
- 비용 절감을 위해서 RDS를 현재 사용하지 않으며, EC2 내 docker를 활용하여 mysql 사용
![image](https://github.com/user-attachments/assets/25370fc9-881b-4b76-951b-9bb6761974f9)



## 서버 설계 및 구현
### Ci/CD
- dfdf
![Group 45](https://github.com/user-attachments/assets/25899316-047d-4bab-9b13-30f0f3e299e1)

### DB 설계
- DB는 mysql을 사용하였으며 ERDCloud(Online Tool)을 사용하여 schema를 설계하였습니다.
![image](https://github.com/user-attachments/assets/0726c027-76e3-454e-b7eb-fcac55781c15)

### Envionment 관리
- AWS 서비스 중 AWS Systems Manager Parameter Store를 활용하여 중요 ENV 관리
- .env에선 AWS parameter store에 접속하기 위한 정보만 가지고 있다.
![envvv](https://github.com/user-attachments/assets/34db1186-4f6c-4610-9757-dc9490b1dfe5)

### 코드 구현
- NestJS의 TypeORM을 사용하여 Mysql 연동
- API 문서화를 위해 Swagger 연동
- 정보(기상, 뉴스) 서드파티 API 연동 및 Cron을 사용하여 주기적으로 실행
- S3의 보안을 위해 Presigned url을 활용한 음성 파일 업데이트
- Oauth를 통한 카카오, 구글, 네이버 로그인
- Config Module에 Parameter store 연동
- Jenkins를 통해 CI/CD 파이프라인 구축

```bash
├── Dockerfile
├── Jenkinsfile
├── README.md
├── nest-cli.json
├── output.txt
├── package-lock.json
├── package.json
├── src
|  ├── alarm
|  |  ├── alarm.controller.spec.ts
|  |  ├── alarm.controller.ts
|  |  ├── alarm.entity.ts
|  |  ├── alarm.module.ts
|  |  ├── alarm.service.spec.ts
|  |  ├── alarm.service.ts
|  |  ├── dto
|  |  |  ├── request.ts
|  |  |  └── response.ts
|  |  └── information
|  |     ├── news.entity.ts
|  |     ├── news.service.ts
|  |     ├── weather.entity.ts
|  |     └── weather.service.ts
|  ├── app.module.ts
|  ├── auth
|  |  ├── auth.controller.spec.ts
|  |  ├── auth.controller.ts
|  |  ├── auth.entity.ts
|  |  ├── auth.module.ts
|  |  ├── auth.service.spec.ts
|  |  ├── auth.service.ts
|  |  ├── dto
|  |  |  ├── request.ts
|  |  |  └── response.ts
|  |  ├── jwt.strategy.ts
|  |  ├── oauth
|  |  |  ├── google.factory.ts
|  |  |  ├── kakao.factory.ts
|  |  |  ├── naver.factory.ts
|  |  |  └── oauth.factory.ts
|  |  └── sso.test.html
|  ├── config
|  |  ├── config.module.ts
|  |  ├── config.service.spec.ts
|  |  ├── config.service.ts
|  |  └── dto
|  |     └── config.ts
|  ├── contact
|  |  ├── contact.controller.spec.ts
|  |  ├── contact.controller.ts
|  |  ├── contact.entity.ts
|  |  ├── contact.module.ts
|  |  ├── contact.service.spec.ts
|  |  ├── contact.service.ts
|  |  └── dto
|  |     ├── request.ts
|  |     └── response.ts
|  ├── etc
|  |  ├── etc.controller.spec.ts
|  |  ├── etc.controller.ts
|  |  └── etc.module.ts
|  ├── extension
|  |  ├── date.ts
|  |  └── extension.ts
|  ├── faq
|  |  ├── dto
|  |  |  ├── request.ts
|  |  |  └── response.ts
|  |  ├── faq.controller.spec.ts
|  |  ├── faq.controller.ts
|  |  ├── faq.entity.ts
|  |  ├── faq.module.ts
|  |  ├── faq.service.spec.ts
|  |  └── faq.service.ts
|  ├── main.ts
|  ├── notice
|  |  ├── dto
|  |  |  ├── request.ts
|  |  |  └── response.ts
|  |  ├── notice.controller.spec.ts
|  |  ├── notice.controller.ts
|  |  ├── notice.entity.ts
|  |  ├── notice.module.ts
|  |  ├── notice.service.spec.ts
|  |  └── notice.service.ts
|  ├── storage
|  |  ├── dto
|  |  |  ├── request.ts
|  |  |  └── response.ts
|  |  ├── storage.controller.spec.ts
|  |  ├── storage.controller.ts
|  |  ├── storage.module.ts
|  |  ├── storage.service.spec.ts
|  |  └── storage.service.ts
|  ├── typeorm
|  |  └── typeorm.module.ts
|  ├── user
|  |  ├── dto
|  |  |  ├── request.ts
|  |  |  └── response.ts
|  |  ├── user.controller.spec.ts
|  |  ├── user.controller.ts
|  |  ├── user.decorator.ts
|  |  ├── user.entity.ts
|  |  ├── user.module.ts
|  |  ├── user.service.spec.ts
|  |  └── user.service.ts
|  └── voice
|     ├── dto
|     |  ├── request.ts
|     |  └── response.ts
|     ├── voice.controller.spec.ts
|     ├── voice.controller.ts
|     ├── voice.entity.ts
|     ├── voice.module.ts
|     ├── voice.service.spec.ts
|     └── voice.service.ts
├── tsconfig.build.json
└── tsconfig.json
```
