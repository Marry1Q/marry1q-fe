"use client";

import React from "react";
import { HanaIcon, IconSelector } from "./HanaIcon";
import { IconName } from "@/lib/iconMapping";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export function IconExample() {
  const [selectedIcon, setSelectedIcon] = React.useState<IconName>("star");

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>하나은행 3D 아이콘 시스템</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span>선택된 아이콘:</span>
            <HanaIcon name={selectedIcon} size={48} />
            <span className="text-sm text-gray-500">{selectedIcon}</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <HanaIcon name="star" size={32} />
            <HanaIcon name="house_blue_roof" size={32} />
            <HanaIcon name="rocket" size={32} />
            <HanaIcon name="gift_box" size={32} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>아이콘 선택기</CardTitle>
        </CardHeader>
        <CardContent>
          <IconSelector
            selectedIcon={selectedIcon}
            onIconSelect={setSelectedIcon}
            category="wedding"
          />
        </CardContent>
      </Card>
    </div>
  );
}
