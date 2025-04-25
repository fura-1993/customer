'use client';

import React from 'react';
import { UploadButton as UTUploadButton } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { Button } from '@/components/ui/button';

interface UploadButtonProps {
  jobId: string;
  type: 'before' | 'after' | 'scene' | 'doc' | 'video';
  onUploadComplete?: () => void;
}

export function UploadButton({ jobId, type, onUploadComplete }: UploadButtonProps) {
  const endpoint = getEndpointByType(type);

  return (
    <UTUploadButton<OurFileRouter, any>
      endpoint={endpoint}
      onClientUploadComplete={() => {
        if (onUploadComplete) {
          onUploadComplete();
        }
      }}
      onUploadError={(error: Error) => {
        console.error(`アップロードエラー: ${error.message}`);
        alert(`アップロードエラー: ${error.message}`);
      }}
      content={{
        button({ ready }) {
          if (ready) {
            return <Button type="button">ファイルを選択</Button>;
          }
          return <Button type="button" disabled>読み込み中...</Button>;
        },
        allowedContent({ ready, isUploading }) {
          if (!ready) return '読み込み中...';
          if (isUploading) return 'アップロード中...';
          
          if (type === 'video') {
            return '動画ファイル (最大256MB)';
          } else if (type === 'doc') {
            return 'PDF (最大8MB)';
          } else {
            return '画像ファイル (最大4MB)';
          }
        },
      }}
      input={{ jobId, type }}
    />
  );
}

function getEndpointByType(type: string) {
  switch (type) {
    case 'before':
    case 'after':
    case 'scene':
      return 'imageUploader';
    case 'doc':
      return 'documentUploader';
    case 'video':
      return 'videoUploader';
    default:
      return 'imageUploader';
  }
}
