# RUSH

유튜브로 같은 음악을 들으면서 실시간 채팅을 할 수 있는 웹 애플리케이션입니다.

## 시작하기

아래는 이 프로젝트를 설치하는 방법입니다.

### 요구사항

현재 리눅스에서는 유튜브 관련 기능이 제대로 동작하지 않고 있습니다. (FFMPEG 관련 오류)
```
node.js를 실행할 수 있는 Windows 운영체제
```

### 설치하기

의존성 라이브러리 및 [FFMPEG 설치](https://ffmpeg.zeranoe.com/builds/)

```
npm install
```

**PORT**(기본 8080), **APIKEY** 환경변수를 등록하거나 코드에서 수정해주세요.

```
(app.js)

youtube.setKey("유튜브 API 키");
const port = process.env.PORT || 8080;
```

마지막으로 실행합니다.

```
npm start

(또는)

node app.js
```

## 시스템 명령어

유튜브 관련 명령어를 알아봅시다.

### !검색

유튜브에 검색할 단어를 같이 입력해주세요.

```
!검색 [검색할 단어]
```

### !재생

유튜브 비디오ID를 같이 입력하세요.

```
!재생 [비디오ID]
```

## 제작자

* 전체 프로젝트 진행 - [hw4n](https://github.com/hw4n)
* 컨셉 아이디어 제공 - [RAKER-BOT](https://github.com/RAKER-BOT)

## 그 외

* 개발 기간 : 2019년 11월 17일 ~ 12월 15일
* 실질적 커밋 횟수 : 16회