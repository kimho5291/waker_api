
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
  
- Waker-api는 waker 어플리케이션에서 사용하는 백엔드 API 서버입니다.
- 클라우드 인프라를 AWS를 통해서 구축하였습니다.
- [CI/CD] Jenkins를 활용하여 배포가 가능합니다.
- 기상(가상청 공공 데이터), 뉴스(딥서치 뉴스 API) 정보를 가져와 사용합니다.

### Tech Stack
<p align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/typescript-123?style=for-the-badge&logo=typescript&logoColor=%233178C6">
  <img alt="Static Badge" src="https://img.shields.io/badge/nestjs-123?style=for-the-badge&logo=nestjs&logoColor=%23E0234E">
  <img alt="Static Badge" src="https://img.shields.io/badge/mysql-123?style=for-the-badge&logo=mysql&logoColor=%234479A1">
  <img alt="Static Badge" src="https://img.shields.io/badge/redis-123?style=for-the-badge&logo=redis&logoColor=%23FF4438">
  <img alt="Static Badge" src="https://img.shields.io/badge/git-123?style=for-the-badge&logo=git&logoColor=%23F05032">
  <img alt="Static Badge" src="https://img.shields.io/badge/jenkins-123?style=for-the-badge&logo=jenkins&logoColor=%23D24939">
  <img alt="Static Badge" src="https://img.shields.io/badge/amazonec2-123?style=for-the-badge&logo=amazonec2&logoColor=%23FF9900">

</p>

## 프로젝트 기여
1. UX/UI 디자인
2. 클라우드 인프라 구성
3. 서버 설계 및 구현

## 링크
Swagger: <a href="https://api.vvaker.com/api">링크</a> <br>
디자인: <a href="https://www.figma.com/design/al2sXFT1PyxuZOE3mhgBy9/waker_hi-fi?node-id=0-1&t=eGh9JdMahgkOUPZb-1">Figma<a>

### DB
DB는 mysql을 사용하였으며 ERDCloud(Online Tool)을 사용하여 schema를 설계하였습니다.
![image](https://github.com/user-attachments/assets/0726c027-76e3-454e-b7eb-fcac55781c15)



## 기여한 부분


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
