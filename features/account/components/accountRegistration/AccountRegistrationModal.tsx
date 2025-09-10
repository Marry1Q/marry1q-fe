import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OpenBankingAccount } from "../../api/accountApi";
import { Account } from "../../types";
import { AccountListStep } from "./AccountListStep";
import { RegistrationStep } from "./RegistrationStep";

interface AccountRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingAccounts: Account[];
}

type Step = 'list' | 'registration';

export function AccountRegistrationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  existingAccounts 
}: AccountRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('list');
  const [selectedAccounts, setSelectedAccounts] = useState<OpenBankingAccount[]>([]);

  const handleAccountSelection = (accounts: OpenBankingAccount[]) => {
    setSelectedAccounts(accounts);
    setCurrentStep('registration');
  };

  const handleRegistrationComplete = () => {
    onSuccess();
    onClose();
    // 상태 초기화
    setCurrentStep('list');
    setSelectedAccounts([]);
  };

  const handleClose = () => {
    onClose();
    // 상태 초기화
    setCurrentStep('list');
    setSelectedAccounts([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle 
            className="text-xl text-gray-900"
            style={{ fontFamily: "Hana2-CM" }}
          >
            {currentStep === 'list' ? '계좌 추가' : '계좌 추가'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {currentStep === 'list' && (
            <AccountListStep
              onNext={handleAccountSelection}
              onClose={handleClose}
              existingAccounts={existingAccounts}
            />
          )}
          
          {currentStep === 'registration' && (
            <RegistrationStep
              selectedAccounts={selectedAccounts}
              onComplete={handleRegistrationComplete}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
