'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const adminLoginSchema = z.object({
  email: z.string().email({
    message: '有効なメールアドレスを入力してください',
  }),
  password: z.string().min(6, {
    message: 'パスワードは6文字以上で入力してください',
  }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: AdminLoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      setError('ログイン処理中にエラーが発生しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="******"
                  {...field}
                  disabled={isLoading}
                />
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>
    </Form>
  );
}
