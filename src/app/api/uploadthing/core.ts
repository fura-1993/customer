import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSupabaseServer } from "@/lib/supabaseService";
import { cookies } from "next/headers";
 
const f = createUploadthing();

type FileUploadMetadata = {
  jobId: string;
  type?: string;
};

const auth = async () => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("jatrack_auth");
  
  if (!authCookie || authCookie.value !== "authenticated") {
    throw new Error("認証されていません");
  }
  
  return { uploadedBy: "authenticated" };
};

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      return await auth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const supabase = getSupabaseServer();
      const meta = metadata as unknown as FileUploadMetadata;
      
      if (!meta.jobId || !meta.type) {
        throw new Error("必要なメタデータが不足しています");
      }
      
      const path = `jobs/${meta.jobId}/${file.key}`;
      
      await supabase.from("assets").insert({
        job_id: meta.jobId,
        type: meta.type,
        url: path,
        filename: file.name,
      });
      
      return { url: file.url, path };
    }),
  
  documentUploader: f({ pdf: { maxFileSize: "8MB" } })
    .middleware(async ({ req }) => {
      return await auth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const supabase = getSupabaseServer();
      const meta = metadata as unknown as FileUploadMetadata;
      
      if (!meta.jobId) {
        throw new Error("必要なメタデータが不足しています");
      }
      
      const path = `jobs/${meta.jobId}/${file.key}`;
      
      await supabase.from("assets").insert({
        job_id: meta.jobId,
        type: "doc",
        url: path,
        filename: file.name,
      });
      
      return { url: file.url, path };
    }),
  
  videoUploader: f({ video: { maxFileSize: "256MB" } })
    .middleware(async ({ req }) => {
      return await auth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const supabase = getSupabaseServer();
      const meta = metadata as unknown as FileUploadMetadata;
      
      if (!meta.jobId) {
        throw new Error("必要なメタデータが不足しています");
      }
      
      const path = `jobs/${meta.jobId}/${file.key}`;
      
      await supabase.from("assets").insert({
        job_id: meta.jobId,
        type: "video",
        url: path,
        filename: file.name,
      });
      
      return { url: file.url, path };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof uploadRouter;
