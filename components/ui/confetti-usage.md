h# Confetti 컴포넌트 사용법

## 개요
`react-confetti` 라이브러리를 기반으로 한 재사용 가능한 컨페티 효과 컴포넌트입니다.

## 컴포넌트

### ConfettiEffect
메인 컨페티 효과 컴포넌트입니다.

#### Props
- `isActive: boolean` - 컨페티 활성화 여부
- `onComplete?: () => void` - 컨페티 완료 시 콜백
- `duration?: number` - 지속 시간 (기본값: 5000ms)
- `colors?: string[]` - 컨페티 색상 배열
- `numberOfPieces?: number` - 컨페티 조각 수 (기본값: 200)
- `recycle?: boolean` - 재활용 여부 (기본값: false)
- `gravity?: number` - 중력 효과 (기본값: 0.3)
- `wind?: number` - 바람 효과 (기본값: 0.05)
- `className?: string` - 추가 CSS 클래스

### useConfetti
컨페티를 쉽게 제어할 수 있는 훅입니다.

#### 반환값
- `isActive: boolean` - 현재 활성화 상태
- `trigger: (duration?: number) => void` - 컨페티 실행 함수

## 사용 예제

### 기본 사용법
```tsx
import { ConfettiEffect, useConfetti } from '@/components/ui/confetti';

function MyComponent() {
  const { isActive, trigger } = useConfetti();

  const handleSuccess = () => {
    trigger(3000); // 3초간 컨페티 실행
  };

  return (
    <div>
      <ConfettiEffect isActive={isActive} />
      <button onClick={handleSuccess}>성공!</button>
    </div>
  );
}
```

### 자동 실행 (컴포넌트 마운트 시)
```tsx
import { ConfettiEffect, useConfetti } from '@/components/ui/confetti';
import { useEffect } from 'react';

function SuccessPage() {
  const { isActive, trigger } = useConfetti();

  useEffect(() => {
    trigger(3000); // 페이지 로드 시 자동 실행
  }, [trigger]);

  return (
    <div>
      <ConfettiEffect isActive={isActive} />
      <h1>축하합니다!</h1>
    </div>
  );
}
```

### 커스텀 설정
```tsx
<ConfettiEffect 
  isActive={isActive}
  colors={['#ff0000', '#00ff00', '#0000ff']}
  numberOfPieces={300}
  gravity={0.5}
  wind={0.1}
  duration={8000}
/>
```

## 실제 적용 사례

### 1. 거래 성공 페이지
- 위치: `features/account/components/TransactionSuccess.tsx`
- 기능: 입금/출금 성공 시 자동으로 컨페티 실행
- 색상: 입금 시 초록/파랑 계열, 출금 시 빨강/핑크 계열

### 2. 목표 달성 시
- 위치: `features/plan1q/components/GoalCard.tsx`
- 기능: 목표 진행률이 100% 달성 시 컨페티 실행
- 조건: 한 번만 실행되도록 상태 관리

### 3. 데모 페이지
- 위치: `app/confetti-demo/page.tsx`
- 기능: 다양한 컨페티 효과 테스트 가능

## 팁

1. **성능 최적화**: `numberOfPieces`를 적절히 조절하여 성능을 최적화하세요.
2. **색상 선택**: 브랜드 색상이나 상황에 맞는 색상을 선택하세요.
3. **지속 시간**: 사용자 경험을 고려하여 적절한 지속 시간을 설정하세요.
4. **중복 실행 방지**: `useState`를 사용하여 중복 실행을 방지하세요.

## 데모 페이지 접속
컨페티 효과를 테스트하려면 `/confetti-demo` 페이지를 방문하세요. 