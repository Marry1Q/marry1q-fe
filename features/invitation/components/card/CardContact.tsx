import React, { useState } from "react";
import AccountSection from "./AccountSection";

interface CardContactProps {
  contact: { groom: string; bride: string };
  accountMessage?: string;
  accountInfo?: {
    groom?: {
      name: string;
      accountNumber: string;
      bankName: string;
      fieldId: string;
    };
    bride?: {
      name: string;
      accountNumber: string;
      bankName: string;
      fieldId: string;
    };
  };
  isPreview?: boolean;
}

export function CardContact({ contact, accountMessage, accountInfo, isPreview }: CardContactProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 디버깅을 위한 로그
  console.log('CardContact - accountInfo:', accountInfo);
  console.log('CardContact - groom accountNumber:', accountInfo?.groom?.accountNumber);
  console.log('CardContact - bride accountNumber:', accountInfo?.bride?.accountNumber);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // 기본 메시지
  const defaultMessage = `참석이 어려워 직접 축하를 전하지 못하는
분들을 위해 계좌번호를 기재하였습니다.
넓은 마음으로 양해 부탁드립니다.
전해주시는 진심은 소중하게 간직하여
좋은 부부의 모습으로 보답하겠습니다.`;

  // accountInfo가 없으면 빈 배열 반환
  if (!accountInfo) {
    return (
      <section className="py-16 px-6 bg-white w-full max-w-sm mx-auto">
        <div className="w-full">
          <div className="text-center mb-8">
            <p className="text-lg mb-4 text-center" style={{ fontFamily: 'Bona Nova SC', color: '#d099a1' }}>
              ACCOUNT
            </p>
            <h2 className="text-xl font-bold text-gray-600">마음 전하실 곳</h2>
          </div>
          <div className="mb-8 text-left">
            <p className="text-sm text-gray-700 leading-relaxed text-center">
              계좌 정보가 없습니다.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 신랑측 계좌 데이터 - 실제 존재하는 계좌만 포함
  const groomAccounts = accountInfo.groom ? [
    {
      name: accountInfo.groom.name,
      accountNumber: accountInfo.groom.accountNumber,
      bankName: accountInfo.groom.bankName,
      fieldId: accountInfo.groom.fieldId
    }
  ] : [];

  // 신부측 계좌 데이터 - 신부 계좌만 포함
  const brideAccounts = accountInfo.bride ? [
    {
      name: accountInfo.bride.name,
      accountNumber: accountInfo.bride.accountNumber,
      bankName: accountInfo.bride.bankName,
      fieldId: accountInfo.bride.fieldId
    }
  ] : [];

  return (
    <section className="py-16 px-6 bg-white w-full max-w-sm mx-auto">
      <div className="w-full">
        {/* 계좌 정보 헤더 */}
        <div className="text-center mb-8">
          <p className="text-lg mb-4 text-center" style={{ fontFamily: 'Bona Nova SC', color: '#d099a1' }}>
            ACCOUNT
          </p>
          <div 
            className="text-base text-gray-800 leading-relaxed text-center"
            dangerouslySetInnerHTML={{ 
              __html: (accountMessage || defaultMessage).replace(/\n/g, '<br>')
            }}
          />
        </div>
        
        {/* 안내 메시지 */}
        <div className="mb-8 text-left">
          
        </div>
        
        {/* 신랑측 계좌 */}
        {groomAccounts.length > 0 && (
          <AccountSection
            title="신랑측"
            accounts={groomAccounts}
            onCopy={handleCopy}
            copiedField={copiedField}
          />
        )}
        
        {/* 신부측 계좌 */}
        {brideAccounts.length > 0 && (
          <AccountSection
            title="신부측"
            accounts={brideAccounts}
            onCopy={handleCopy}
            copiedField={copiedField}
          />
        )}
      </div>
    </section>
  );
}