'use server';

import { cookies } from 'next/headers';
import { formatInTimeZone } from 'date-fns-tz';
import { LoginFormValues } from '@/lib/validators';

const generateDailyPassword = (): string => {
  const today = new Date();
  const jstDate = formatInTimeZone(today, 'Asia/Tokyo', 'MMdd');
  return `Jatrack${jstDate}`;
};

export async function login(data: LoginFormValues) {
  const { password } = data;
  const correctPassword = generateDailyPassword();

  if (password === correctPassword) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'jatrack_auth',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24時間
      path: '/',
    });

    return { success: true };
  }

  return { success: false };
}
