import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, CheckCircle, X, MessageCircle } from "lucide-react";

interface GiftMoneyThanksProps {
  gifts: Array<{
    id: number;
    name: string;
    amount: number;
    date: string;
    relationship: string;
    thanksSent: boolean;
    thanksDate?: string;
    thanksSentBy?: string;
  }>;
  onToggleThanks: (id: number) => void;
}

export function GiftMoneyThanks({ gifts, onToggleThanks }: GiftMoneyThanksProps) {
  const completedGifts = gifts.filter(gift => gift.thanksSent);
  const pendingGifts = gifts.filter(gift => !gift.thanksSent);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 인원</p>
                <p className="text-2xl font-bold">{gifts.length}명</p>
              </div>
              <Gift className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">감사 연락 완료</p>
                <p className="text-2xl font-bold text-green-600">{completedGifts.length}명</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">감사 연락 대기</p>
                <p className="text-2xl font-bold text-orange-600">{pendingGifts.length}명</p>
              </div>
              <MessageCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Thanks */}
      {completedGifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              감사 연락 완료 ({completedGifts.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {completedGifts.map((gift, index) => (
                <div key={gift.id || `completed-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{gift.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{gift.relationship}</span>
                          <span>•</span>
                          <span>{gift.amount.toLocaleString()}원</span>
                          <span>•</span>
                          <span>{gift.date}</span>
                        </div>
                        {gift.thanksDate && gift.thanksSentBy && (
                          <p className="text-sm text-green-600 mt-1">
                            감사 연락 완료 ({gift.thanksDate}) - {gift.thanksSentBy}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        완료
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleThanks(gift.id)}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Thanks */}
      {pendingGifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              감사 연락 대기 ({pendingGifts.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pendingGifts.map((gift, index) => (
                <div key={gift.id || `pending-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{gift.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{gift.relationship}</span>
                          <span>•</span>
                          <span>{gift.amount.toLocaleString()}원</span>
                          <span>•</span>
                          <span>{gift.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        <X className="w-3 h-3 mr-1" />
                        미완료
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleThanks(gift.id)}
                        className="bg-[#008485] text-white hover:bg-[#006b6b]"
                      >
                        완료
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {gifts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              축의금 내역이 없습니다
            </h3>
            <p className="text-gray-500">
              축의금을 등록하면 감사 연락 현황을 관리할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 