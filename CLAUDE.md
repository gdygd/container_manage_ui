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
 ├─ api/  # API 요청 모듈
 ├─ components/  # 공용 컴포넌트
 ├─ features/  # 도메인 단위 기능 (containers, services 등)
 ├─ hooks/ # Custom Hooks
 ├─ pages/ # 라우팅 단위 페이지
 ├─ types/ # 공용 TypeScript 타입
 ├─ utils/ # 유틸 함수
 ├─ styles/ # 전역 스타일
 └─ main.tsx
```

---

## Coding Conventions

### TypeScript
- any 사용 금지
- API 응답은 반드시 type 또는 interface로 정의
- null / undefined 명확히 구분

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
