export type Customer = {
  id: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  customer_id: string;
  site_address: string;
  description: string;
  start_date: string;
  end_date: string | null;
  amount: number;
  periodic: boolean;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export type Asset = {
  id: string;
  job_id: string;
  type: 'before' | 'after' | 'scene' | 'doc' | 'video';
  url: string;
  filename: string;
  created_at: string;
};

export type Worker = {
  id: string;
  job_id: string;
  name: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
      };
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>;
      };
      assets: {
        Row: Asset;
        Insert: Omit<Asset, 'id' | 'created_at'>;
        Update: Partial<Omit<Asset, 'id' | 'created_at'>>;
      };
      workers: {
        Row: Worker;
        Insert: Omit<Worker, 'id' | 'created_at'>;
        Update: Partial<Omit<Worker, 'id' | 'created_at'>>;
      };
    };
  };
};
