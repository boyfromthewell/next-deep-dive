# Next.js의 렌더링 방식

## 서버 사이드 렌더링 (SSR)

- 가장 기본적인 사전 렌더링 방식
- 요청이 들어올 때 마다 사전 렌더링 진행

## 정적 사이트 생성 (SSG)

- 사전 렌더링 방식이지만, 빌드 타임에 미리 페이지를 사전 렌더링
- 사전 렌더링에 많은 시간이 소요되는 페이지더라도 사용자 요청에는 매우 빠른 속도로 응답
- 최신 데이터 반영 어렵, 정적인 페이지에 적합

## 증분 정적 재생성 (ISR)