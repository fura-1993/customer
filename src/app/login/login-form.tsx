'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { login } from './action';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(data);
      
      if (result.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('パスワードが正しくありません');
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="日替わりパスワードを入力"
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
