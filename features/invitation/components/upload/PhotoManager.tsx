"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload, X, ChevronLeft, ChevronRight } from "lucide-react"

interface PhotoManagerProps {
  uploadedPhotos: string[]
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemovePhoto: (index: number) => void
  onMovePhoto: (fromIndex: number, toIndex: number) => void
}

export function PhotoManager({ 
  uploadedPhotos, 
  onPhotoUpload, 
  onRemovePhoto, 
  onMovePhoto 
}: PhotoManagerProps) {
  return (
    <div className="space-y-6">
      {/* 사진 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-green-500" />
            사진 업로드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">사진을 업로드하세요</p>
              <Button variant="outline" size="sm" className="mt-2">
                사진 선택
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 업로드된 사진 목록 */}
      {uploadedPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>업로드된 사진 ({uploadedPhotos.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`사진 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemovePhoto(index)}
                      className="w-6 h-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  {index > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMovePhoto(index, index - 1)}
                      className="absolute top-2 left-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                  )}
                  {index < uploadedPhotos.length - 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMovePhoto(index, index + 1)}
                      className="absolute top-2 left-8 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 