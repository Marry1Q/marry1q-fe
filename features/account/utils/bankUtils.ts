// 은행 코드 및 관련 유틸리티 함수들

/**
 * 한국의 주요 은행 코드 매핑
 * 한국은행 표준 은행 코드 기준
 */
export const BANK_CODES = {
  // 시중은행
  '한국은행': '001',
  '산업은행': '002', 
  'IBK기업은행': '003',
  '기업은행': '003',
  'KB국민은행': '004',
  '국민은행': '004',
  '하나은행': '081',
  'KEB하나은행': '081',
  '신한은행': '088',
  '수협은행': '007',
  '수협중앙회': '007',
  '농협은행': '011',
  'NH농협은행': '011',
  '농협': '011',
  '단위농협': '012',
  '우리은행': '020',
  'SC제일은행': '023',
  '제일은행': '023',
  '한국씨티은행': '027',
  '씨티은행': '027',
  '대구은행': '031',
  '부산은행': '032',
  '광주은행': '034',
  '제주은행': '035',
  '전북은행': '037',
  '경남은행': '039',
  
  // 특수은행
  '한국산업은행': '002',
  '한국수출입은행': '008',
  '중소기업은행': '003',
  
  // 상호저축은행
  '새마을금고': '045',
  '신협': '048',
  '신용협동조합': '048',
  
  // 증권회사
  '미래에셋증권': '230',
  '대우증권': '238',
  '삼성증권': '240',
  'NH투자증권': '247',
  '키움증권': '264',
  
  // 카카오뱅크, 케이뱅크 등 인터넷 전문은행
  '카카오뱅크': '090',
  '케이뱅크': '089',
  '토스뱅크': '092',
  
  // 우체국
  '우체국': '071'
} as const;

/**
 * 은행별 계좌번호 패턴 정의
 * 계좌번호 앞자리로 은행을 추천할 때 사용
 */
export const BANK_PATTERNS = [
  {
    name: "하나은행",
    code: "081",
    patterns: [
      "110", "111", "112", "113", "114", "115", "116", "117", "118", "119",
    ],
  },
  {
    name: "국민은행",
    code: "004",
    patterns: ["123", "124", "125", "126", "127", "128", "129"],
  },
  { 
    name: "신한은행", 
    code: "088",
    patterns: ["456", "457", "458", "459"] 
  },
  {
    name: "우리은행",
    code: "020",
    patterns: [
      "100", "101", "102", "103", "104", "105", "106", "107", "108", "109",
    ],
  },
  {
    name: "기업은행",
    code: "003",
    patterns: ["003", "004", "005", "006", "007", "008", "009"],
  },
  {
    name: "농협은행",
    code: "011",
    patterns: ["301", "302", "303", "304", "305", "306", "307", "308", "309"],
  },
  {
    name: "새마을금고",
    code: "045",
    patterns: [
      "900", "901", "902", "903", "904", "905", "906", "907", "908", "909",
    ],
  },
  { 
    name: "카카오뱅크", 
    code: "090",
    patterns: ["333"] 
  },
  { 
    name: "케이뱅크", 
    code: "089",
    patterns: ["089"] 
  },
  { 
    name: "토스뱅크", 
    code: "092",
    patterns: ["092"] 
  },
];

/**
 * 은행 로고 매핑
 * 은행 코드에 해당하는 로고 파일 경로
 */
export const BANK_LOGOS: Record<string, string> = {
  '081': '/bankLogo/hana.png', // 하나은행
  '004': '/bankLogo/kb.png', // KB국민은행 (추후 추가)
  '020': '/bankLogo/woori.png', // 우리은행 (추후 추가)
  '003': '/bankLogo/ibk.png', // IBK기업은행 (추후 추가)
  '011': '/bankLogo/nh.png', // NH농협은행 (추후 추가)
  '007': '/bankLogo/suhyup.png', // 수협은행 (추후 추가)
  '089': '/bankLogo/kbank.png', // 케이뱅크 (추후 추가)
  '090': '/bankLogo/kakao.png', // 카카오뱅크 (추후 추가)
  '092': '/bankLogo/toss.png', // 토스뱅크 (추후 추가)
};

/**
 * 은행명을 은행 코드로 변환
 * @param bankName 은행명 (예: "KB국민은행", "하나은행")
 * @returns 은행 코드 (예: "004", "005") 또는 null (찾을 수 없는 경우)
 */
export const getBankCode = (bankName: string): string | null => {
  if (!bankName) return null;
  
  // 정확히 일치하는 경우
  if (BANK_CODES[bankName as keyof typeof BANK_CODES]) {
    return BANK_CODES[bankName as keyof typeof BANK_CODES];
  }
  
  // 부분 매칭으로 찾기 (공백 제거 후)
  const normalizedBankName = bankName.replace(/\s+/g, '');
  
  for (const [key, code] of Object.entries(BANK_CODES)) {
    const normalizedKey = key.replace(/\s+/g, '');
    if (normalizedBankName.includes(normalizedKey) || normalizedKey.includes(normalizedBankName)) {
      return code;
    }
  }
  
  return null;
};

/**
 * 은행 코드를 로고 경로로 변환
 * @param bankCode 은행 코드 (예: "081", "004")
 * @returns 로고 파일 경로 또는 null (찾을 수 없는 경우)
 */
export const getBankLogo = (bankCode: string): string | null => {
  if (!bankCode) return null;
  
  return BANK_LOGOS[bankCode] || null;
};

/**
 * 은행 코드를 로고 경로로 변환 (기본 로고 포함)
 * @param bankCode 은행 코드 (예: "081", "004")
 * @returns 로고 파일 경로 (기본 로고가 없으면 null)
 */
export const getBankLogoWithFallback = (bankCode: string): string | null => {
  if (!bankCode) return null;
  
  // 특정 은행 로고가 있으면 반환
  if (BANK_LOGOS[bankCode]) {
    return BANK_LOGOS[bankCode];
  }
  
  // 기본 은행 로고 반환 (추후 기본 로고 추가 시 사용)
  return null;
};

/**
 * 은행명을 로고 경로로 변환
 * @param bankName 은행명 (예: "하나은행", "KB국민은행")
 * @returns 로고 파일 경로 또는 null (찾을 수 없는 경우)
 */
export const getBankLogoByName = (bankName: string): string | null => {
  const bankCode = getBankCode(bankName);
  if (!bankCode) return null;
  
  return getBankLogo(bankCode);
};

/**
 * 은행 정보 객체 반환 (이름, 코드, 로고)
 * @param bankCode 은행 코드 (예: "081")
 * @returns 은행 정보 객체 또는 null
 */
export const getBankInfo = (bankCode: string): { name: string; code: string; logo: string | null } | null => {
  if (!bankCode) return null;
  
  const name = getBankName(bankCode);
  if (!name) return null;
  
  return {
    name,
    code: bankCode,
    logo: getBankLogo(bankCode)
  };
};

/**
 * 은행 코드를 은행명으로 변환
 * @param bankCode 은행 코드 (예: "004", "005")
 * @returns 은행명 또는 null (찾을 수 없는 경우)
 */
export const getBankName = (bankCode: string): string | null => {
  if (!bankCode) return null;
  
  for (const [name, code] of Object.entries(BANK_CODES)) {
    if (code === bankCode) {
      return name;
    }
  }
  
  return null;
};

/**
 * 은행 목록 가져오기 (selectbox 등에서 사용)
 * @returns 은행 목록 배열
 */
export const getBankList = () => {
  // 중복 제거된 은행 목록 반환 (코드 기준으로 그룹핑)
  const uniqueBanks = new Map<string, string>();
  
  Object.entries(BANK_CODES).forEach(([name, code]) => {
    if (!uniqueBanks.has(code)) {
      uniqueBanks.set(code, name);
    }
  });
  
  return Array.from(uniqueBanks.entries()).map(([code, name]) => ({
    code,
    name,
    value: name,
    label: name
  })).sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * 계좌번호 유효성 검사
 * @param accountNumber 계좌번호
 * @param bankCode 은행 코드 (선택사항)
 * @returns 유효성 검사 결과
 */
export const validateAccountNumber = (accountNumber: string, bankCode?: string) => {
  if (!accountNumber) {
    return {
      isValid: false,
      message: '계좌번호를 입력해주세요.'
    };
  }
  
  // 계좌번호는 숫자와 하이픈만 허용
  const accountNumberRegex = /^[0-9-]+$/;
  if (!accountNumberRegex.test(accountNumber)) {
    return {
      isValid: false,
      message: '계좌번호는 숫자와 하이픈(-)만 입력 가능합니다.'
    };
  }
  
  // 하이픈 제거 후 숫자만 추출
  const numbersOnly = accountNumber.replace(/-/g, '');
  
  // 최소 길이 검사 (대부분의 은행이 10자리 이상)
  if (numbersOnly.length < 10) {
    return {
      isValid: false,
      message: '계좌번호가 너무 짧습니다. (최소 10자리)'
    };
  }
  
  // 최대 길이 검사 (하나은행 등 일부 은행은 15자리까지 사용)
  if (numbersOnly.length > 15) {
    return {
      isValid: false,
      message: '계좌번호가 너무 깁니다. (최대 15자리)'
    };
  }
  
  return {
    isValid: true,
    message: '유효한 계좌번호입니다.'
  };
};

/**
 * 계좌번호 포맷팅 (하이픈 추가)
 * @param accountNumber 계좌번호
 * @param bankCode 은행 코드 (선택사항)
 * @returns 포맷팅된 계좌번호
 */
export const formatAccountNumber = (accountNumber: string, bankCode?: string): string => {
  if (!accountNumber) return '';
  
  // 숫자만 추출
  const numbersOnly = accountNumber.replace(/[^0-9]/g, '');
  
  // 은행별 포맷 규칙 (기본적인 규칙만 적용)
  // 대부분의 은행: XXX-XX-XXXXXX 형태
  if (numbersOnly.length >= 10) {
    return numbersOnly.replace(/(\d{3})(\d{2})(\d+)/, '$1-$2-$3');
  } else if (numbersOnly.length >= 5) {
    return numbersOnly.replace(/(\d{3})(\d+)/, '$1-$2');
  }
  
  return numbersOnly;
};

/**
 * 은행명 정규화 (검색/매칭용)
 * @param bankName 은행명
 * @returns 정규화된 은행명
 */
export const normalizeBankName = (bankName: string): string => {
  return bankName
    .replace(/\s+/g, '') // 공백 제거
    .replace(/은행$/, '') // 마지막 '은행' 제거
    .toLowerCase(); // 소문자 변환
};

/**
 * 유효한 은행인지 확인
 * @param bankName 은행명
 * @returns 유효 여부
 */
export const isValidBank = (bankName: string): boolean => {
  return getBankCode(bankName) !== null;
};

/**
 * 계좌번호로 은행 추천 (은행 정보 객체 반환)
 * @param accountNumber 계좌번호
 * @returns 추천 은행 정보 객체 또는 null
 */
export const detectBankFromAccountNumber = (accountNumber: string): { name: string; code: string; patterns: string[] } | null => {
  if (!accountNumber) return null;
  
  const cleanNumber = accountNumber.replace(/[^\d]/g, "");
  if (cleanNumber.length >= 3) {
    const prefix = cleanNumber.slice(0, 3);
    const bank = BANK_PATTERNS.find((bank) => bank.patterns.includes(prefix));
    return bank || null;
  }
  return null;
};

/**
 * 계좌번호로 은행명 추천
 * @param accountNumber 계좌번호
 * @returns 추천 은행명 또는 빈 문자열
 */
export const detectBankNameFromAccountNumber = (accountNumber: string): string => {
  const bank = detectBankFromAccountNumber(accountNumber);
  return bank?.name || "";
};

/**
 * 계좌번호로 은행 코드 추천
 * @param accountNumber 계좌번호
 * @returns 추천 은행 코드 또는 빈 문자열
 */
export const detectBankCodeFromAccountNumber = (accountNumber: string): string => {
  const bank = detectBankFromAccountNumber(accountNumber);
  return bank?.code || "";
};

/**
 * 계좌번호로 은행 로고 추천
 * @param accountNumber 계좌번호
 * @returns 추천 은행 로고 경로 또는 null
 */
export const detectBankLogoFromAccountNumber = (accountNumber: string): string | null => {
  const bank = detectBankFromAccountNumber(accountNumber);
  if (!bank) return null;
  
  return getBankLogo(bank.code);
};
