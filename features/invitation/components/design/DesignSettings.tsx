"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout, Palette } from "lucide-react"

interface Template {
  id: number
  name: string
  preview: string
}

interface ColorOption {
  name: string
  value: string
}

interface DesignSettingsProps {
  selectedTemplate: number
  selectedColor: string
  onTemplateChange: (templateId: number) => void
  onColorChange: (colorName: string) => void
  availableTemplates: Template[]
  colorOptions: ColorOption[]
}

export function DesignSettings({ 
  selectedTemplate, 
  selectedColor, 
  onTemplateChange, 
  onColorChange, 
  availableTemplates, 
  colorOptions 
}: DesignSettingsProps) {
  return (
    <div className="space-y-6">
      {/* 템플릿 변경 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-blue-500" />
            템플릿 변경
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableTemplates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                  selectedTemplate === template.id
                    ? "border-[#008485] bg-[#008485]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                <div className="aspect-[3/4] bg-gray-100 rounded mb-2">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <p className="text-sm font-medium text-center">{template.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 색상 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-500" />
            색상 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-3">
            {colorOptions.map((color) => (
              <div
                key={color.name}
                className={`w-12 h-12 rounded-lg cursor-pointer border-2 transition-all ${
                  selectedColor === color.name ? "border-gray-400 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => onColorChange(color.name)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 