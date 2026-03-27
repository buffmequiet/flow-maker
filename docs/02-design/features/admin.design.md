# Flow Maker Admin — Design

## 1. 전체 구조

```
/                   → 어드민 메인 (인증 없음, 바로 진입)
/partners           → 제휴업체 목록
/partners/new       → 업체 등록 폼
/partners/[id]      → 업체 상세
/partners/[id]/edit → 업체 수정
```

---

## 2. 페이지별 설계

### 2-1. 메인 (`/`)
- 사이드바 또는 상단 네비 포함 레이아웃
- 대시보드 역할: 등록 업체 수 요약 카드 (유형별)
- "업체 등록" CTA 버튼

---

### 2-2. 제휴업체 목록 (`/partners`)

**레이아웃**
- 상단: 서비스 유형 필터 탭 (전체 / K뷰티 / 마사지 / 택시 / 밴 / ...)
- 카드 그리드: 업체별 카드 (대표이미지 자리 + 업체명 + 유형 + 활성 상태)
- 우상단: "업체 등록" 버튼

**업체 카드**
- 대표 이미지 썸네일 (없으면 placeholder)
- 업체명 (한글)
- 서비스 유형 뱃지
- 활성/비활성 토글
- 클릭 → 상세 페이지 이동

---

### 2-3. 업체 등록 (`/partners/new`)

**폼 섹션 순서**

1. **기본 정보**
   - 업체명 (한글) — 필수
   - 업체명 (영어)
   - 서비스 유형 — 드롭다운 (필수)

2. **이미지**
   - 파일 선택 버튼
   - 선택 시 미리보기 표시 (실제 업로드 없음, UI 데모용)
   - 이미지 URL 직접 입력 필드 (저장 시 이 값 사용)

3. **연락처**
   - 전화번호
   - 카카오톡 ID

4. **운영시간**
   - 요일별 (월~일) 시작시간 ~ 종료시간
   - 각 요일별 "휴무" 체크박스

5. **가격표**
   - 항목 추가 버튼 → 항목명 + 금액(KRW) 행 추가
   - 행 삭제 가능
   - 최소 1개 이상 권장

6. **제휴 수수료**
   - % 입력 (숫자)

7. **내부 메모**
   - textarea

**하단 액션**
- "등록하기" 버튼 → bkend `fm_partners` 테이블에 저장 → 목록 페이지 이동
- "취소" → 목록으로 이동

---

### 2-4. 업체 상세 (`/partners/[id]`)

- 등록된 정보 조회 (읽기 전용)
- "수정" 버튼 → `/partners/[id]/edit`
- "비활성화" / "활성화" 토글
- "삭제" 버튼 (확인 모달)

---

### 2-5. 업체 수정 (`/partners/[id]/edit`)

- 등록 폼과 동일 구조, 기존 데이터 pre-fill
- "저장" → bkend 업데이트
- "취소" → 상세 페이지로

---

## 3. bkend 테이블 스키마

### `fm_partners`

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `name_ko` | string | 업체명 한글 |
| `name_en` | string | 업체명 영어 |
| `service_type` | string | K뷰티 / 마사지 / 택시 / 밴 / 기타 |
| `image_url` | string | 대표 이미지 URL |
| `contact_phone` | string | 전화번호 |
| `contact_kakao` | string | 카카오톡 ID |
| `operating_hours` | object | 요일별 { open, close, closed } |
| `price_items` | array | [{ label, price_krw }] |
| `commission_rate` | number | 수수료 % |
| `memo` | string | 내부 메모 |
| `is_active` | boolean | 활성 여부 |
| `created_at` | string | 등록일시 (ISO) |

---

## 4. API Route 설계

| 메서드 | 경로 | 역할 |
|--------|------|------|
| GET | `/api/partners` | 전체 목록 조회 (유형 필터 지원) |
| POST | `/api/partners` | 업체 등록 |
| GET | `/api/partners/[id]` | 단건 조회 |
| PUT | `/api/partners/[id]` | 수정 |
| DELETE | `/api/partners/[id]` | 삭제 |
| PATCH | `/api/partners/[id]/status` | 활성/비활성 토글 |

---

## 5. UI 스타일 방향

- Tailwind CSS, 깔끔한 어드민 스타일
- 사이드바 고정 레이아웃 (좌측 네비)
- 색상: 다크 사이드바 + 흰 본문
- 모바일 대응은 최소화 (어드민이므로 데스크톱 우선)
