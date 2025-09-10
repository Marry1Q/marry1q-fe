"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ListLayoutProps {
  children: React.ReactNode
}

export function ListLayout({ children }: ListLayoutProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {children}
        </div>
      </CardContent>
    </Card>
  )
} 