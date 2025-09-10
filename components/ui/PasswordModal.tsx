import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/ui/SubmitButton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect } from "react"
import Image from "next/image"

interface PasswordModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  password: string
  onPasswordChange: (password: string) => void
  onConfirm: () => void
}

export function PasswordModal({
  isOpen,
  onOpenChange,
  password,
  onPasswordChange,
  onConfirm,
}: PasswordModalProps) {

  // 모달이 닫힐 때 포커스 정리
  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 포커스를 body로 이동
      document.body.focus()
    }
  }, [isOpen])

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="password-modal-title"
        aria-describedby="password-modal-description"
      >
        <DialogHeader className="flex items-center gap-2">
          <DialogTitle 
            id="password-modal-title"
            style={{ fontFamily: 'Hana2-Regular' }}
          >
            비밀번호 입력
          </DialogTitle>
        </DialogHeader>
        <div id="password-modal-description" className="sr-only">
          6자리 비밀번호를 입력해주세요. 숫자 버튼을 클릭하여 비밀번호를 입력하고, 확인 버튼을 눌러 진행하세요.
        </div>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center gap-2 mt-4 mb-4">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 ${
                  index < password.length ? "bg-[#008485]" : "bg-transparent"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <Button
                key={num}
                variant="outline"
                className="h-12 text-lg font-bold"
                onClick={() => {
                  if (password.length < 6) {
                    onPasswordChange(password + num.toString())
                  }
                }}
                aria-label={`숫자 ${num} 입력`}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-12 text-lg font-bold"
              onClick={() => onPasswordChange(password.slice(0, -1))}
              aria-label="마지막 숫자 삭제"
            >
              ←
            </Button>
            <div className="h-12 flex items-center justify-center">
              <Image
                src="/hanabnak.png"
                alt="하나은행 로고"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
          </div>
          
          <SubmitButton
            onClick={onConfirm}
            disabled={password.length !== 6}
          >
            확인
          </SubmitButton>
        </div>
      </DialogContent>
    </Dialog>
  )
} 