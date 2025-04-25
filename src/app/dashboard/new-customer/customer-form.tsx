'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { customerSchema, type CustomerFormValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getSupabaseServer } from '@/lib/supabaseService';

export default function CustomerForm({ customer }: { customer?: CustomerFormValues & { id?: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      name: '',
      address: '',
    },
  });

  async function onSubmit(data: CustomerFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createOrUpdateCustomer(data, customer?.id);
      
      if (result.success) {
        router.push(result.id ? `/dashboard/${result.id}` : '/dashboard');
        router.refresh();
      } else {
        setError('顧客情報の保存中にエラーが発生しました');
      }
    } catch (error) {
      setError('顧客情報の保存中にエラーが発生しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>お客様氏名</FormLabel>
              <FormControl>
                <Input placeholder="例: 山田太郎" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>お客様住所</FormLabel>
              <FormControl>
                <Input placeholder="例: 東京都新宿区西新宿2-8-1" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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

async function createOrUpdateCustomer(data: CustomerFormValues, id?: string) {
  'use server';
  
  const supabase = getSupabaseServer();
  
  try {
    if (id) {
      const { error } = await supabase
        .from('customers')
        .update({
          name: data.name,
          address: data.address,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, id };
    } else {
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          address: data.address,
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      return { success: true, id: newCustomer.id };
    }
  } catch (error) {
    console.error('顧客データの保存エラー:', error);
    return { success: false };
  }
}
