"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Loader2, Sparkles } from "lucide-react";
import { colors } from "@/constants/colors";
import Image from "next/image";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import Iridescence from "@/components/ui/Iridescence/Iridescence";
import { authApi } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerEmail: "",
    customerPw: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // 페이지 로드 시 애니메이션
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "올바른 이메일 형식을 입력해주세요";
    }
    
    if (!formData.customerPw) {
      newErrors.customerPw = "비밀번호를 입력해주세요";
    } else if (formData.customerPw.length < 6) {
      newErrors.customerPw = "비밀번호는 6자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 메시지 초기화 (필요한 경우에만)
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }, [errors]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast("입력 정보를 확인해주세요");
      return;
    }

    try {
      setIsLoading(true);
      const result = await authApi.login(formData);
      
      if (result.success) {
        showSuccessToast("로그인에 성공했습니다!");
        
        // URL 파라미터에서 returnUrl 확인
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        
        // returnUrl이 있으면 해당 페이지로, 없으면 홈으로
        const redirectPath = returnUrl || '/';
        router.push(redirectPath);
      } else {
        showErrorToast(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error('Login error:', error);
      showErrorToast("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  // Iridescence 배경 컴포넌트 메모이제이션
  const backgroundComponent = useMemo(() => (
    <div className="absolute inset-0 pointer-events-none">
      <Iridescence 
        color={[0.9, 0.8, 1]}
        speed={0.8}
        amplitude={0.2}
        mouseReact={false}
      />
    </div>
  ), []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Iridescence 배경 - 메모이제이션된 컴포넌트 */}
      {backgroundComponent}

      <div className={`w-full max-w-6xl transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        {/* 2열 레이아웃 컨테이너 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            
            {/* 왼쪽 열 - Marry1Q 소개 */}
            <div className="bg-gradient-to-br p-8 lg:p-12 flex flex-col text-white relative overflow-hidden">
              {/* 배경 장식 요소 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 mt-10 ml-2">
                {/* 로고 */}
                <div className="flex justify-start mb-6">
                  <div className="relative group">
                    <Image
                      src="/Marry1Q_logo.png"
                      alt="Marry1Q"
                      width={80}
                      height={80}
                      className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </div>
                </div>
                
                {/* 서비스 소개 */}
                <div className="text-left space-y-4">
                  <h1 
                    className="text-3xl lg:text-4xl font-bold text-gray-700"
                    style={{ fontFamily: "Hana2-CM" }}
                  >
                    Marry1Q
                  </h1>
                  <p
                    className="text-xl text-gray-700"
                    style={{ fontFamily: "Hana2-CM" }}
                  >
                    복잡한 결혼, 한 큐에 Marry1Q에서!
                  </p>
                </div>
              </div>
            </div>
            
            {/* 오른쪽 열 - 로그인 폼 */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* 이메일 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-700" style={{ fontFamily: "Hana2-CM" }}>
                      이메일
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-200 group-focus-within:text-[#F0426B]" />
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        className={`pl-10 h-12 border-gray-300 hover:border-[#F0426B] focus:border-[#F0426B] focus:ring-[#F0426B]/20 transition-all duration-200 ${
                          errors.customerEmail ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                        }`}
                        required
                      />
                    </div>
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs" style={{ fontFamily: "Hana2-CM" }}>{errors.customerEmail}</p>
                    )}
                  </div>

                  {/* 비밀번호 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="customerPw" className="text-sm font-medium text-gray-700" style={{ fontFamily: "Hana2-CM" }}>
                      비밀번호
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-200 group-focus-within:text-[#F0426B]" />
                      <Input
                        id="customerPw"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력하세요"
                        value={formData.customerPw}
                        onChange={(e) => handleInputChange("customerPw", e.target.value)}
                        className={`pl-10 pr-10 h-12 border-gray-300 hover:border-[#F0426B] focus:border-[#F0426B] focus:ring-[#F0426B]/20 transition-all duration-200 ${
                          errors.customerPw ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.customerPw && (
                      <p className="text-red-500 text-xs" style={{ fontFamily: "Hana2-CM" }}>{errors.customerPw}</p>
                    )}
                  </div>

                  {/* 로그인 버튼 */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-white font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none active:scale-95"
                    style={{ 
                      fontFamily: "Hana2-CM",
                      backgroundColor: colors.hana.red.main
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        로그인 중...
                      </>
                    ) : (
                      "로그인"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
