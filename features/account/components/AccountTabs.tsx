"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AccountTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function AccountTabs({ activeTab, onTabChange }: AccountTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="overview">거래내역</TabsTrigger>
        <TabsTrigger value="recurring">자동이체</TabsTrigger>
        <TabsTrigger value="card">체크카드 설정</TabsTrigger>
      </TabsList>
    </Tabs>
  )
} 