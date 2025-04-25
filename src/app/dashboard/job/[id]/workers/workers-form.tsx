'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { workersSchema, type WorkersFormValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { saveWorkers } from './actions';

interface Worker {
  id: string;
  job_id: string;
  name: string;
  created_at: string;
}

export default function WorkersForm({ 
  jobId,
  initialWorkers = [],
}: { 
  jobId: string;
  initialWorkers: Worker[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<WorkersFormValues>({
    resolver: zodResolver(workersSchema),
    defaultValues: {
      workers: initialWorkers.length > 0 
        ? initialWorkers.map(worker => ({ name: worker.name }))
        : [{ name: '' }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workers",
  });

  async function onSubmit(data: WorkersFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await saveWorkers(jobId, data.workers, initialWorkers);
      
      if (result.success) {
        router.refresh();
        setError(null);
      } else {
        setError('作業員情報の保存中にエラーが発生しました');
      }
    } catch (error) {
      setError('作業員情報の保存中にエラーが発生しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">作業員リスト</h2>
          <p className="text-sm text-muted-foreground">最大20名まで登録可能</p>
        </div>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`workers.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                      作業員名
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 山田太郎" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="mt-8"
                onClick={() => remove(index)}
                disabled={fields.length === 1 || isLoading}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">削除</span>
              </Button>
            </div>
          ))}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => append({ name: '' })}
          disabled={fields.length >= 20 || isLoading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          作業員を追加
        </Button>
        
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
