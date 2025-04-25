import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSupabaseServer } from '@/lib/supabaseService';
import { UploadButton } from '@/components/upload-button';
import { deleteAsset } from './actions';

export const metadata: Metadata = {
  title: 'ファイル管理 | 顧客管理システム',
  description: '案件のファイルを管理するページです',
};

export const dynamic = 'force-dynamic';

export default async function JobFilesPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = getSupabaseServer();
  
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();
  
  if (jobError || !job) {
    notFound();
  }
  
  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*')
    .eq('job_id', id)
    .order('created_at', { ascending: false });
  
  if (assetsError) {
    console.error('アセットデータの取得エラー:', assetsError);
  }
  
  const assetsByType = {
    before: assets?.filter(asset => asset.type === 'before') || [],
    after: assets?.filter(asset => asset.type === 'after') || [],
    scene: assets?.filter(asset => asset.type === 'scene') || [],
    doc: assets?.filter(asset => asset.type === 'doc') || [],
    video: assets?.filter(asset => asset.type === 'video') || [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ファイル管理</h1>
        <Link href={`/dashboard/job/${id}`} passHref>
          <Button variant="outline">案件詳細へ戻る</Button>
        </Link>
      </div>
      
      <div className="rounded-lg border p-4 bg-muted/50">
        <h2 className="text-lg font-semibold">案件情報</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <span className="text-muted-foreground">顧客名:</span> {job.customers.name}
          </div>
          <div>
            <span className="text-muted-foreground">作業内容:</span> {job.description}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="before" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="before">作業前写真</TabsTrigger>
          <TabsTrigger value="after">作業後写真</TabsTrigger>
          <TabsTrigger value="scene">作業風景写真</TabsTrigger>
          <TabsTrigger value="doc">書類</TabsTrigger>
          <TabsTrigger value="video">動画</TabsTrigger>
        </TabsList>
        
        <TabsContent value="before" className="space-y-4">
          <div className="flex justify-end">
            <UploadButton jobId={id} type="before" />
          </div>
          <FileGrid files={assetsByType.before} jobId={id} />
        </TabsContent>
        
        <TabsContent value="after" className="space-y-4">
          <div className="flex justify-end">
            <UploadButton jobId={id} type="after" />
          </div>
          <FileGrid files={assetsByType.after} jobId={id} />
        </TabsContent>
        
        <TabsContent value="scene" className="space-y-4">
          <div className="flex justify-end">
            <UploadButton jobId={id} type="scene" />
          </div>
          <FileGrid files={assetsByType.scene} jobId={id} />
        </TabsContent>
        
        <TabsContent value="doc" className="space-y-4">
          <div className="flex justify-end">
            <UploadButton jobId={id} type="doc" />
          </div>
          <FileGrid files={assetsByType.doc} jobId={id} />
        </TabsContent>
        
        <TabsContent value="video" className="space-y-4">
          <div className="flex justify-end">
            <UploadButton jobId={id} type="video" />
          </div>
          <FileGrid files={assetsByType.video} jobId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface Asset {
  id: string;
  job_id: string;
  type: string;
  url: string;
  filename: string;
  created_at: string;
}

function FileGrid({ files, jobId }: { files: Asset[]; jobId: string }) {
  if (files.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">ファイルがありません</p>
        <p className="text-sm text-muted-foreground mt-2">
          上部のボタンからファイルをアップロードしてください
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} jobId={jobId} />
      ))}
    </div>
  );
}

function FileCard({ file }: { file: Asset; jobId: string }) {
  
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="p-4">
        <h3 className="font-medium truncate">{file.filename}</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(file.created_at).toLocaleString('ja-JP')}
        </p>
      </div>
      
      <div className="flex justify-end p-2 bg-muted/20 border-t">
        <form action={() => deleteAsset(file.id)}>
          <Button variant="outline" size="sm" type="submit" className="text-destructive">
            削除
          </Button>
        </form>
        <a
          href={`/api/files/${file.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2"
        >
          <Button size="sm">表示</Button>
        </a>
      </div>
    </div>
  );
}
