# Next.js의 렌더링 방식

## 서버 사이드 렌더링 (SSR)

- 가장 기본적인 사전 렌더링 방식
- 요청이 들어올 때 마다 사전 렌더링 진행

## 정적 사이트 생성 (SSG)

- 사전 렌더링 방식이지만, 빌드 타임에 미리 페이지를 사전 렌더링
- 사전 렌더링에 많은 시간이 소요되는 페이지더라도 사용자 요청에는 매우 빠른 속도로 응답
- 최신 데이터 반영 어렵, 정적인 페이지에 적합
- 동적 경로의 경우 getStaticPath 메서드 통해 빌드 타임에 경로 설정 -> 사전 렌더링 진행
  - id: 1, id: 2, id: 3 -> book/1, book/2, book/3
- getStaticPath: fallback 옵션 지원
  - fallback = false: path에 설정하지 않는 모든 경로는 모두 404
  - blocking: SSR 방식으로 실시간 페이지 생성 (사전 렌더링)
  - fallback = true: fallback 상태의 페이지 (props 데이터가 없는 상태의 페이지)부터 생성해 보냄 -> props 계산해 데이터 있는 상태의 페이지 다시 렌더링

## 증분 정적 재생성 (ISR, Incremental Static Regeneration)

- 일정 시간 주기로 SSG로 생성된 페이지 다시 생성하도록 해 새로운 페이지 반환 가능한 기술
- 기존 SSG 방식의 장점(매우 빠른 응답 속도)과 SSR 방식의 장점(최신 데이터 반영 가능)을 가짐

  - 요청 받을때 마다 페이지를 다시 생성도 가능 (On-Demand ISR)
