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

4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 props는 전달 불가<br/>
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

## Request Memoization

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

## Full Route Cache

- Next 서버에서 빌드 타임에 특정 페이지의 렌더링 결과를 캐시 하는 기술
- page router의 SSG와 유사

* 어떤 기능을 사용하는지에 따라 자동으로 나뉨 (서버 컴포넌트에만 해당)
  - dynamic page
    - 캐시되지 않는 데이터 패칭을 사용할 경우
    - 동적 함수(쿠키, 헤더, 쿼리스트링)를 사용하는 컴포넌트가 있을 때
  - static page
    - dynamic page가 아니면 모두 static page
    - 풀 라우트 캐시 적용
    - revalidate도 가능

#### 동적 경로를 가지는 페이지도 풀 라우트 캐시 적용하려면

```tsx
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
```

- 컴포넌트 상단에, 해당 함수 작성으로 서버에 미리 동적 경로를 알려주어 빌드 타임에 페이지 미리 만들어 둠

```tsx
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
```

- `export const dynamicParams = false;`
- generateStaticParams 메서드로 내보내진 1, 2, 3의 값 외에는 모두 유효하지 않는 동적 경로로 판단, 404 페이지로 보내버림

### 라우트 세그먼트 옵션

특정 페이지에 캐싱이나 revalidate 강제로 설정해주는 추가적인 옵션

- dynamic: 특정 페이지의 유형을 강제로 static, dynamic 페이지로 설정

```tsx
export const dynamic = "";
```

1. auto: 기본값, 아무것도 강제하지 않음
2. force-dynamic: 페이지 강제로 dynamic 페이지로 설정
3. force-static: 페이지 강제로 static 페이지로 설정
4. error: 페이지 강제로 static 페이지로 설정 (설정하면 안되는 이유 -> 빌드 오류)

- but, 특정한 상황이 아니라면 사용하는것을 권장하지는 않음

### 클라이언트 라우터 캐시

- 브라우저에 저장되는 캐시, 페이지 이동 효율적으로 진행 위해 페이지 일부 데이터 보관
- 페이지마다 공통되는 레이아웃, 컴포넌트 브라우저에 캐시로 next에서 자동 저장

## 스트리밍 (streaming)

- 데이터를 빠르게 전송하기 어려울때 데이터를 조각내 서버에서 클라이언트에 연속적으로 전달해주는 기술
- next에서는 dynamic page에 자주 사용

### 페이지 스트리밍

```tsx
export default function Loading() {
  return <div>loading...</div>;
}
```

적용하고 싶은 페이지 동일 선상에 loading.tsx 만들면 자동으로 대체 ui 생성

- 현재 경로에 있는 페이지 컴포넌트 뿐만 아닌, 해당 경로 안에 있는 모든 비동기 페이지 컴포넌트까지 스트리밍 해줌
- 비동기/페이지 컴포넌트에만 스트리밍 지원

* 쿼리 스트링의 값만 바뀐경우는 적용 되지 않음

### 컴포넌트 스트리밍

리액트의 suspense 활용해야 함

```tsx
// example
import BookItem from "@/components/book-item";
import { BookData } from "@/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

async function SearchResult({ q }: { q: string }) {
  await delay(1500);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" }
  );
  if (!res.ok) {
    return <div>오류가 발생했습니다!</div>;
  }
  const books: BookData[] = await res.json();

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const { q } = await searchParams;
  return (
    <Suspense fallback={<div>loading</div>}>
      <SearchResult q={q || ""} />;
    </Suspense>
  );
}
```

- 하지만 쿼리스트링이 변하는 경우 suspense는 동작하지 않음
- suspense 컴포넌트 어트리뷰트에 키 값 지정해주면 그 값이 변할때 마다 동작

```tsx
// ...
const { q } = await searchParams;
return (
  <Suspense key={q || ""} fallback={<div>loading</div>}>
    <SearchResult q={q || ""} />;
  </Suspense>
);
```

### 에러 핸들링

- 에러 핸들링할 파일만 생성해주면 됨 (error.tsx)

```tsx
"use client";

import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <div>오류가 발생했습니다.</div>;
}
```

서버나 클라이언트 모든 오류에 대응하기 위해 클라이언트 컴포넌트로 생성

### 서버 액션

브라우저에서 호출할 수 있는 서버에서 실행되는 비동기 함수

- 클라이언트에서 특정 폼, 양식의 제출이 발생했을때 서버측에서만 실행되는 어떤 함수를 실행시켜 줌

```tsx
// create-review.action.ts
"use server";

export async function createReviewAction(formData: FormData) {
  const bookId = formData.get("bookId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!bookId || !content || !author) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          author,
          bookId,
        }),
      }
    );
    console.log(res.status);
  } catch (err) {
    console.error(err);
    return;
  }
}

function ReviewEditor({ id }: { id: string }) {
  return (
    <section>
      <form action={createReviewAction}>
        <input name="bookId" value={id} hidden readOnly />
        <input name="content" placeholder="리뷰 내용" required />
        <input name="author" placeholder="작성자" required />
        <button type="submit">작성 하기</button>
      </form>
    </section>
  );
}
```

조금 더 간결하고 편리하게 서버측에서 실행되는 어떤 동작을 정의하는데 유용

### 재검증 구현

```tsx
"use server";

import { revalidatePath } from "next/cache";

export async function createReviewAction(formData: FormData) {
  const bookId = formData.get("bookId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!bookId || !content || !author) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          author,
          bookId,
        }),
      }
    );
    revalidatePath(`/book/${bookId}`);
  } catch (err) {
    console.error(err);
    return;
  }
}
```

- revalidatePath(): 인수로 전달한 경로에 해당하는 페이지를 재검증 (다시 생성)
  - 서버 컴포넌트에서만 호출 가능
  - 페이지를 전부 재검증하기 때문에 해당 되는 페이지의 자식 컴포넌트 등의 모든 캐시를 무효화 (다시 생성되기 때문에)
  - 풀 라우트 캐시 무효화 되고 업데이트 안됨

#### 그 외 재검증 방식

1. 특정 주소의 해당하는 페이지만 재검증

```tsx
revalidatePath(`/book/${bookId}`);
```

2. 특정 경로의 모든 동적 페이지 재검증

```tsx
revalidatePath("/book/[id]", "page");
```

3. 특정 레이아웃을 갖는 모든 페이지 재검증

```tsx
revalidatePath("/(with-searchbar)", "layout");
```

4. 모든 데이터 재검증

```tsx
revalidatePath("/", "layout");
```

5. 태그 기준, 데이터 캐시 재검증

```tsx
// ...
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
  { next: { tags: [`reviews-${bookId}`] } }
);
```

```tsx
// ...
revalidateTag(`reviews-${bookId}`);
```

### 클라이언트 컴포넌트 서버액션

- useActionState hook: react 19에서 처음 도입
  - 첫번째 인수: 핸들링 하려는 액션 함수
  - 두번째 인수: 상태 초기값

예제 코드

```tsx
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createReviewAction(_: any, formData: FormData) {
  const bookId = formData.get("bookId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!bookId || !content || !author)
    return {
      status: false,
      error: "리뷰 내용과 작성자를 입력 해주세요.",
    };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          author,
          bookId,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    revalidateTag(`reviews-${bookId}`);
    return {
      status: true,
      error: "",
    };
  } catch (err) {
    return {
      status: false,
      error: `리뷰 저장에 실패했습니다. ${err}`,
    };
  }
}
```

```tsx
"use client";
import style from "./review-editer.module.css";
import { createReviewAction } from "@/actions/create-review.action";
import { useActionState } from "react";

export default function ReviewEditor({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <section className={style.form_container}>
      <form action={formAction}>
        <input name="bookId" value={id} hidden readOnly />
        <textarea
          disabled={isPending}
          name="content"
          placeholder="리뷰 내용"
          required
        />
        <div className={style.submit_container}>
          <input
            disabled={isPending}
            name="author"
            placeholder="작성자"
            required
          />
          <button disabled={isPending} type="submit">
            {isPending ? "..." : "작성하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
```

- state: 서버 액션 수행 후 return 해준 state 값 담김
- formAction: 서버 액션 실행 함수 = createReviewAction
- isPending: 서버 액션 수행 중 = true

### Parallel Route

- 한 화면안에 여러 개 페이지를 병렬로 렌더링 시켜주는 패턴
- slot 폴더 생성: 병렬로 렌더링 될 페이지 컴포넌트 보관하는 폴더 (ex. @sidebar)
- 부모 레이아웃 파일에 props로 자동 전달 가능

```tsx
// ...
import { ReactNode } from "react";

export default function Layout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div>
      {sidebar}
      {children}
    </div>
  );
}
```

### Intercepting Route

- rink, route (클라이언트 사이드 방식) 통해 접속한 경우에만 인터셉팅 라우트 적용
- 가로채 보여줄 페이지를 (경로) 붙여 폴더 생성 ex) (.)book/[id], (..)book/[id]
