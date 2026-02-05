# CLAUDE.md

## Project Overview
이 프로젝트는 **React + TypeScript** 기반의 **컨테이너 모니터링 시스템 UI**이다.  
백엔드는 컨테이너 에이전트 및 SaaS 서버와 통신하며, UI는 실시간 상태 조회와 시각화를 담당한다.

### Core Features
- 컨테이너 목록 조회
- 컨테이너 상세 정보 (inspect)
- 리소스 통계 (CPU, Memory, Network, Disk)
- 이벤트 스트림 (start, stop, die 등)
- 실시간 데이터 업데이트 (SSE / WebSocket)
- 멀티 서비스 / 멀티 환경 지원

---

## Tech Stack
- React 18
- TypeScript
- 상태 관리: React Query / Zustand
- 차트: ECharts
- 스타일: Tailwind CSS
- HTTP Client: fetch
- 실시간 통신: SSE 또는 WebSocket

---

## Project Structure
```
src/
 ├─ app/                 # 앱 전역 설정 (라우터, 전역 상태, QueryClient 등 앱 초기화 영역)
 │   ├─ router.tsx       # 전체 라우팅 정의 (React Router 설정)
 │   ├─ queryClient.ts   # React Query 전역 설정 (cache, retry, default options)
 │   └─ store.ts         # 전역 UI 상태 관리 (Zustand store)
 │
 ├─ api/                 # 공통 HTTP 레이어 (fetch 래퍼, 에러 규약)
 │   ├─ http.ts          # 공통 fetch 래퍼 (에러 처리, 헤더, credentials)
 │   └─ error.ts         # API 에러 타입 및 공통 에러 처리 유틸
 │
 ├─ features/            # 도메인(기능) 단위 코드 모음 (비즈니스 로직의 중심)
 │   ├─ containers/      # 컨테이너 관련 기능 (목록, 상태, 통계 등)
 │   │   ├─ api.ts       # 컨테이너 관련 API 호출 함수
 │   │   ├─ hooks.ts     # 컨테이너 전용 React Query / Custom Hooks
 │   │   ├─ types.ts     # 컨테이너 도메인 타입 정의
 │   │   ├─ components/ # 컨테이너 전용 UI 컴포넌트
 │   │   └─ index.ts     # 외부 노출용 barrel 파일
 │   │
 │   ├─ services/        # 서비스/애플리케이션 단위 도메인 기능
 │   └─ events/          # 이벤트/SSE 관련 도메인 (로그, 스트림 처리)
 │
 ├─ components/          # 전역 재사용 UI 컴포넌트 (비즈니스 의미 없음)
 │                        # ex) Button, Card, Table, Modal
 │
 ├─ pages/               # 라우트 단위 페이지 컴포넌트 (조합 역할, 로직 최소화)
 │
 ├─ hooks/               # 여러 feature에서 공통으로 사용하는 Custom Hooks
 │                        # ex) useDebounce, useInterval
 │
 ├─ styles/              # 전역 스타일 설정 (Tailwind config, global css)
 │
 ├─ types/               # 전역 공통 타입 (feature에 종속되지 않는 타입)
 │                        # ex) ID, ApiError, Pagination
 │
 ├─ utils/               # 순수 유틸 함수 (비즈니스/React 의존 없음)
 │
 └─ main.tsx             # React 앱 엔트리 포인트

```

---

## Coding Conventions

### TypeScript
- any 사용 금지
- API 응답은 반드시 type 또는 interface로 정의
- null / undefined 명확히 구분
- TypeScript의 클린코드 적용

### React
- 함수형 컴포넌트만 사용
- 비즈니스 로직은 Custom Hook으로 분리
- 렌더링과 데이터 로직 분리

---

## API Usage Rules
- API 호출은 src/api 하위에서만 수행
- UI 컴포넌트에서 직접 HTTP 호출 금지
- 공통 에러 처리 방식 유지

---

## Real-time Data Handling
- SSE/WebSocket 전용 Hook 사용
- 언마운트 시 연결 해제 필수
- 이벤트 타입별 명확한 타입 정의

---

## Performance Guidelines
- 불필요한 re-render 방지
- 대규모 데이터 pagination 또는 virtualization 적용

---

## Security
- 민감 정보 하드코딩 금지
- 환경 변수로 설정 관리

---

## AI Assistant Instructions
- 기존 코드 스타일 존중
- 타입 안정성 최우선
- 불확실한 구현은 질문
