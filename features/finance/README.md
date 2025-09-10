# Finance API 연동 가이드

## 📋 개요

Finance 기능은 커플의 가계부 관리를 위한 API 연동이 완료되었습니다. 거래 내역 관리, 예산 설정, 카테고리 관리 기능을 제공합니다.

## 🏗️ 구조

```
features/finance/
├── api/                    # API 클라이언트
│   ├── financeApi.ts      # 거래 내역 API
│   ├── budgetApi.ts       # 예산 API
│   └── categoryApi.ts     # 카테고리 API
├── types/                  # 타입 정의
│   ├── transaction.ts     # 거래 내역 타입
│   ├── budget.ts          # 예산 타입
│   └── category.ts        # 카테고리 타입
├── store/                  # 상태 관리
│   ├── financeStore.ts    # 거래 내역 상태
│   ├── budgetStore.ts     # 예산 상태
│   └── selectors.ts       # 상태 선택자
├── utils/                  # 유틸리티
│   └── currencyUtils.ts   # 금액 처리 유틸리티
├── hooks/                  # 커스텀 훅
│   └── useFinanceData.ts  # Finance 데이터 훅
└── components/            # 컴포넌트 (기존)
```

## 🔧 주요 기능

### 1. 거래 내역 관리
- **조회**: 검색, 필터링, 페이징 지원
- **생성**: 새로운 거래 내역 추가
- **수정**: 기존 거래 내역 수정
- **삭제**: 거래 내역 삭제

### 2. 예산 관리
- **대시보드**: 전체 예산 현황 조회
- **카테고리별 예산**: 카테고리별 예산 설정 및 관리
- **실시간 계산**: 지출 금액 자동 계산

### 3. 카테고리 관리
- **기본 카테고리**: 시스템 제공 카테고리
- **커스텀 카테고리**: 사용자 정의 카테고리
- **CRUD**: 카테고리 생성, 수정, 삭제

## 📊 데이터 타입

### BigDecimal 처리
백엔드에서 `BigDecimal`을 사용하므로 프론트엔드에서는 `string`으로 처리합니다.

```typescript
// 변환 유틸리티
parseBigDecimal("1000.50") // string → number
toBigDecimal(1000.50)      // number → string
formatCurrency("1000.50")  // 포맷팅
```

### 주요 타입들
```typescript
// 거래 내역
interface TransactionResponse {
  transactionId: number;
  description: string;
  amount: string; // BigDecimal
  transactionType: 'INCOME' | 'EXPENSE';
  // ...
}

// 예산
interface CategoryBudgetResponse {
  categoryBudgetId: number;
  budgetAmount: string; // BigDecimal
  spentAmount: string;  // BigDecimal
  // ...
}
```

## 🚀 사용법

### 1. Finance 페이지에서 사용

```typescript
import { useFinanceData } from '@/features/finance/hooks/useFinanceData';

export default function FinancePage() {
  const {
    transactions,
    budgetOverview,
    categories,
    loading,
    fetchTransactions,
    deleteTransaction,
  } = useFinanceData();

  // API 데이터 자동 로드
  // 필터링, 페이징, 삭제 등 모든 기능 사용 가능
}
```

### 2. Budget-Settings 페이지에서 사용

```typescript
import { budgetApi, categoryApi } from '@/features/finance/api';
import { useBudgetStore } from '@/features/finance/store/budgetStore';

export default function BudgetSettingsPage() {
  const { categoryBudgets, loading } = useBudgetStore();

  // 예산 업데이트
  const handleUpdateBudget = async (id: number, amount: string) => {
    await budgetApi.updateCategoryBudget(id, { budgetAmount: amount });
  };
}
```

### 3. 직접 API 호출

```typescript
import { financeApi } from '@/features/finance/api';

// 거래 내역 조회
const response = await financeApi.getTransactions({
  searchTerm: "커피",
  categoryId: 1,
  page: 0,
  size: 10
});

// 거래 내역 생성
const newTransaction = await financeApi.createTransaction({
  amount: "5000",
  transactionType: "EXPENSE",
  description: "스타벅스",
  categoryId: 1,
  transactionDate: "2024-01-15"
});
```

## 🔄 상태 관리

### Zustand Store 사용
- `useFinanceStore`: 거래 내역 및 예산 대시보드 상태
- `useBudgetStore`: 예산 설정 전용 상태

### 선택자 (Selectors)
```typescript
import { useFilteredTransactions, useCategoryStats } from '@/features/finance/store/selectors';

// 필터링된 거래 내역
const filteredTransactions = useFilteredTransactions();

// 카테고리별 통계
const categoryStats = useCategoryStats();
```

## 🎨 UI 컴포넌트

### 기존 컴포넌트 활용
- `TransactionList`: 거래 내역 목록
- `TransactionItem`: 거래 내역 아이템
- `MainBudgetCard`: 메인 예산 카드
- `BudgetCategoryCard`: 카테고리별 예산 카드

### 로딩 상태 처리
```typescript
{loading ? (
  <div>로딩 중...</div>
) : (
  <TransactionList transactions={transactions} />
)}
```

## 📝 주의사항

1. **BigDecimal 처리**: 모든 금액은 `string`으로 처리
2. **날짜 형식**: "yyyy-MM-dd" 형식 사용
3. **페이징**: API는 0부터 시작하는 페이지 번호 사용
4. **에러 처리**: toast 알림으로 사용자에게 피드백 제공
5. **실시간 동기화**: 거래 내역 변경 시 예산 자동 업데이트

## 🔗 연관 페이지

- `/finance`: 거래 내역 관리 페이지
- `/budget-settings`: 예산 설정 페이지
- `/finance/create`: 거래 내역 생성 페이지
- `/finance/edit/[id]`: 거래 내역 수정 페이지

## 🧪 테스트

API 연동이 완료되었으므로 다음을 테스트해보세요:

1. **거래 내역 CRUD**: 생성, 조회, 수정, 삭제
2. **필터링**: 검색, 카테고리, 사용자, 날짜 필터
3. **페이징**: 페이지 이동, 페이지 크기 변경
4. **예산 관리**: 예산 설정, 업데이트, 삭제
5. **실시간 동기화**: 거래 내역 변경 시 예산 업데이트

## 📈 향후 개선사항

1. **캐싱**: React Query 도입 고려
2. **실시간 업데이트**: WebSocket 연동
3. **오프라인 지원**: Service Worker 활용
4. **성능 최적화**: 가상화 스크롤 적용
