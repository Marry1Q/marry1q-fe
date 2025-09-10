/**
 * BigDecimal(string)을 number로 변환
 */
export const parseBigDecimal = (value: string): number => {
  if (!value) return 0;
  return parseFloat(value);
};

/**
 * number를 BigDecimal(string)로 변환
 */
export const toBigDecimal = (value: number): string => {
  return value.toString();
};

/**
 * 금액을 한국어 형식으로 포맷팅
 */
export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseBigDecimal(amount) : amount;
  return new Intl.NumberFormat('ko-KR').format(num);
};

/**
 * 금액을 한국어 형식으로 포맷팅 (원 단위 포함)
 */
export const formatCurrencyWithUnit = (amount: string | number): string => {
  return `${formatCurrency(amount)}원`;
};

/**
 * 사용률을 퍼센트 형식으로 포맷팅
 */
export const formatUsageRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};
