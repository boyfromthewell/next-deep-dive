# Next.js의 렌더링 방식 (Page Router)

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

### 단점

1. 페이지별 레이아웃 설정이 번거로움
2. 데이터 페칭이 페이지 컴포넌트에 집중 됨
3. 불 필요한 컴포넌트들도 js bundle에 포함

- hydration에 필요하지 않은 컴포넌트 들도 js bundle에 모두 포함됨 -> 이후 app router에서 server component로 관리 가능

# App router

## React Server Component

- 18v부터 추가, 새로운 유형의 컴포넌트
- 서버측에서만 실행 (브라우저에서 실행 x)

- 서버 컴포넌트 -> 서버측에서 사전 렌더링 진행시 딱 한번만 실행
- 클라이언트 컴포넌트 -> 사전 렌더링 한번, 하이드레이션 한번, 두번 실행
- app router는 기본적으로 서버 컴포넌트 사용

### 주의 사항

1. 서버 컴포넌트에는 브라우저에서 실행될 코드 포함되면 안됨
2. 클라이언트 컴포넌트는 클라이언트에서만 실행되지는 않음

- 사전 렌더링 서버 실행 1번 + 하이드레이션 위한 브라우저 1번 실행 = 서버, 클라이언트 모두 실행

3. 클라이언트 컴포넌트에서 서버 컴포넌트 import 불가능

- 하이드레이션 과정에서 서버 컴포넌트는 js bundle로 부터 제외됨
- Next에서는 이 경우는 자동으로 서버 컴포넌트를 클라이언트 컴포넌트로 변경
- 굳이 써야 한다면 클라이언트 컴포넌트 props에 children으로 넘겨주는것을 추천

```tsx
"use client";

export default function ClientComponent({ children }) {
  console.log("client component");
  return <div>{children}</div>;
}
```

```tsx
import ClientComponent from "./client-component";
import styles from "./page.module.css";
import ServerComponent from "./server-component";

export default function Home() {
  return (
    <div className={styles.page}>
      index
      <ClientComponent>
        <ServerComponent />
      </ClientComponent>
    </div>
  );
}
```

4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 props는 전달 불가
   `사전 렌더링 진행 과정 중`

- 페이지를 구성하는 모든 컴포넌트 -> 서버 컴포넌트들만 따로 실행 (RSC Payload) -> 완성된 HTML 페이지
  - RSC Payload: React Server Component의 순수한 데이터(결과물)
    - React Server Component를 직렬화 한 결과
    - RSC Payload에는 서버 컴포넌트의 모든 데이터가 포함
      - 서버 컴포넌트의 렌더링 결과
      - 연결된 클라이언트 컴포넌트의 위치
      - 클라이언트 컴포넌트에게 전달하는 props 값

## 데이터 패칭

```tsx
// 서버 컴포넌트 + (비동기 함수)
export async function Page(props) {
  const data = await fetch("...");

  return <div>...</div>;
}
```

클라이언트 컴포넌트는 async 키워드 사용할 수 없었음 (브라우저에서 동작시 문제를 일으킬 수 있기 때문에)

### 데이터 캐시

- fetch 메서드에서만 활용 가능

```tsx
const res = await fetch("...", { cache: "force-cache" });
```

- force-cache: 요청의 결과를 무조건 캐싱, 한번 호출된 이후에는 다시는 호출 되지 않음
- no-store: 데이터 패칭의 결과를 저장 x, 캐싱 설정 안함 (모든 데이터 페칭은 디폴트로 no-store)

```tsx
const res = await fetch("...", { next: { revalidate: 3 } });
```

- 특정 시간을 주기로 캐시 업데이트, page router의 ISR 방식과 유사

```tsx
const res = await fetch("...", { next: { tags: ["a"] } });
```

- On-Demand Revalidate, 요청이 들어왔을 때 데이터를 최신화함

### Request Memoization

- 다양한 api 요청 중에 중복되는 요청을 캐싱해 한번만 요청할 수 있도록 자동으로 데이터 패칭 최적화 해주는 기술

* 렌더링이 종료되면 모든 캐시 소멸

```tsx
async function AllBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`);
  if (!res.ok) {
    return <div>오류가 발생했습니다!</div>;
  }
  const allBooks: BookData[] = await res.json();

  return (
    <div>
      {allBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
```

```tsx
async function Footer() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`);
  if (!res.ok) {
    return <footer>제작 @boyfromthewell</footer>;
  }
  const books: BookData[] = await res.json();
  const bookCount = books.length;

  return <footer>제작 @boyfromthewell {bookCount}개의 도서 등록</footer>;
}
```

동일한 요청을 서로 다른 컴포넌트에서 두번 중복 호출 하지만 Request Memoization이 자동으로 동작해 한번만 호출됨
