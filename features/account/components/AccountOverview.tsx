import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft, Copy, Eye, EyeOff, Send } from "lucide-react";
import Link from "next/link";
import { getGradient } from "@/../../constants/colors";
import { toast } from "sonner";
import { colors } from "@/../../constants/colors";
import Image from "next/image";

interface AccountOverviewProps {
  accountBalance: number;
  accountNumber: string;
  accountName: string;
  isBalanceVisible: boolean;
  setIsBalanceVisible: (value: boolean) => void;
  showDepositButton?: boolean;
  showTransferButton?: boolean;
}

export const AccountOverview = ({
  accountBalance,
  accountNumber,
  accountName,
  isBalanceVisible,
  setIsBalanceVisible,
  showDepositButton = true,
  showTransferButton = true,
}: AccountOverviewProps) => {
  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    toast.success("복사 완료!", {
      style: {
        background: colors.primary.toastBg,
        color: colors.primary.main,
        border: `1px solid ${colors.primary.main}`,
        fontFamily: "Hana2-Medium",
      },
    });
  };

  return (
    // <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card
        className="lg:col-span-2 h-60 relative overflow-hidden"
        style={{ 
          background: "linear-gradient(to right, #42D4D4, #F0426B)",
          backdropFilter: "blur(10px)"
        }}
      >
        <CardContent className="p-6 text-white h-full flex flex-col relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/90 mb-2 font-medium">{accountName}</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "Hana2-CM" }}>
                  {isBalanceVisible
                    ? `${accountBalance.toLocaleString()}원`
                    : "••••••••원"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  {isBalanceVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-white/80 text-sm">
                  {accountNumber}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAccountNumber}
                  className="text-white hover:bg-white/20 p-1 rounded-full"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* 구분선 추가 */}
          <div className="w-full h-px bg-white/30 my-4 rounded-full" />

          <div className="absolute bottom-4 -right-8">
            <Image
              src="/hana3dIcon/hanaIcon3d_2_11.png"
              alt="Hana 3D Icon"
              width={160}
              height={160}
              className="opacity-80"
            />
          </div>
          
          {/* 글래스모피즘 하단 영역 */}
          <div className="flex gap-3 mt-auto">
            {showDepositButton && (
              <Link href="/account/deposit">
                <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white flex items-center px-4 py-2 rounded transition-all duration-300 border border-white/30 backdrop-blur-sm">
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  채우기
                </Button>
              </Link>
            )}
            {showTransferButton && (
              <Link href="/account/withdraw">
                <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white flex items-center px-4 py-2 rounded transition-all duration-300 border border-white/30 backdrop-blur-sm">
                  <Send className="w-4 h-4 mr-2" />
                  보내기
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    // </div>
  );
};
