
# OSDC-Frontend

## 프로젝트 구조

```
client/         # React SPA 프론트엔드
	pages/        # 라우트 컴포넌트 (Index.tsx = 대시보드)
	components/   # UI 및 차트 컴포넌트
	hooks/        # 커스텀 훅
	lib/          # 유틸 함수
	global.css    # 전역 스타일
server/         # Express API 백엔드
	index.ts      # 서버 진입점
	routes/       # API 라우트 핸들러
shared/         # 클라이언트/서버 공용 타입
logs/           # 로그 데이터 파일 위치 (필수)
```

## 사용법

1. **의존성 설치**
	 ```bash
	 pnpm install
	 ```

2. **개발 서버 실행**
	 ```bash
	 pnpm dev
	 ```
	 - http://localhost:8080 접속


## 로그 파일 안내

- `logs/` 폴더에 다음 파일들이 반드시 위치해야 합니다:

	- merged_logs_sorted.json
	- merged_messages.json
	- main.4134.log
	- summary_tps.json

로그 파일이 없으면 대시보드가 정상 동작하지 않습니다.