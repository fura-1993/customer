import { z } from 'zod';

export const loginSchema = z.object({
  password: z.string().min(1, {
    message: 'パスワードを入力してください',
  }),
});

export const customerSchema = z.object({
  name: z.string().min(1, {
    message: 'お客様氏名を入力してください',
  }),
  address: z.string().min(1, {
    message: 'お客様住所を入力してください',
  }),
});

export const jobSchema = z.object({
  customer_id: z.string().uuid({
    message: '顧客を選択してください',
  }),
  site_address: z.string().min(1, {
    message: '現場住所を入力してください',
  }),
  description: z.string().min(1, {
    message: '作業内容を入力してください',
  }),
  start_date: z.date({
    required_error: '作業開始日を選択してください',
  }),
  end_date: z.date().nullable().optional(),
  amount: z.number({
    required_error: '請負金額を入力してください',
    invalid_type_error: '数値を入力してください',
  }).min(0, {
    message: '0以上の数値を入力してください',
  }),
  periodic: z.boolean().default(false),
  memo: z.string().nullable().optional(),
});

export const workersSchema = z.array(
  z.object({
    name: z.string().min(1, {
      message: '作業員名を入力してください',
    }),
  })
).max(20, {
  message: '作業員は最大20名まで登録できます',
});

export const fileSchema = z.object({
  type: z.enum(['before', 'after', 'scene', 'doc', 'video'], {
    required_error: 'ファイルタイプを選択してください',
  }),
  file: z.instanceof(File, {
    message: 'ファイルを選択してください',
  }).refine(
    (file) => {
      if (file.type.startsWith('video/')) {
        return file.size <= 500 * 1024 * 1024; // 500MB
      }
      return true;
    },
    {
      message: '動画ファイルは500MB以下にしてください',
    }
  ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CustomerFormValues = z.infer<typeof customerSchema>;
export type JobFormValues = z.infer<typeof jobSchema>;
export type WorkersFormValues = z.infer<typeof workersSchema>;
export type FileFormValues = z.infer<typeof fileSchema>;
