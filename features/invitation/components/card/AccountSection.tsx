import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import AccountItem from './AccountItem';

interface AccountSectionProps {
  title: string;
  accounts: Array<{
    name: string;
    accountNumber: string;
    bankName: string;
    fieldId: string;
  }>;
  onCopy: (text: string, fieldId: string) => void;
  copiedField: string | null;
}

export default function AccountSection({ 
  title, 
  accounts, 
  onCopy, 
  copiedField 
}: AccountSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      <div 
        className="bg-gray-50 rounded-t-lg p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-base font-medium text-gray-900 Pretendard">{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>
      {isExpanded && (
        <div className="border border-gray-200 rounded-b-lg p-4">
          {accounts.map((account, index) => (
            <div key={account.fieldId}>
              <AccountItem
                name={account.name}
                accountNumber={account.accountNumber}
                bankName={account.bankName}
                fieldId={account.fieldId}
                onCopy={onCopy}
                copiedField={copiedField}
              />
              {index < accounts.length - 1 && (
                <div className="border-t border-gray-200 pt-3" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 