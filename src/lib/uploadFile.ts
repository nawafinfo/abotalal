import { supabase } from '@/integrations/supabase/client';

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'audio/mpeg': 'mp3',
  'application/pdf': 'pdf',
};

/** Safe extension: prefers mime type (phones often send odd/no file extensions). */
export const safeExt = (file: File) => {
  const fromMime = MIME_EXT[file.type?.toLowerCase()];
  if (fromMime) return fromMime;
  const raw = file.name?.split('.').pop() || '';
  const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean && clean.length <= 5 ? clean : 'bin';
};

/** ASCII-only unique object key — Arabic/space/emoji filenames break Storage keys on mobile. */
export const safePath = (file: File, prefix = '') => {
  const ext = safeExt(file);
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix ? prefix.replace(/\/+$/, '') + '/' : ''}${unique}.${ext}`;
};

export const MAX_UPLOAD_MB = 25;

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Robust upload used across the app (works with mobile camera / gallery files).
 */
export const uploadToBucket = async (
  bucket: string,
  file: File,
  prefix = ''
): Promise<UploadResult> => {
  if (!file) return { url: null, error: 'لم يتم اختيار ملف' };

  if (file.size === 0) {
    return { url: null, error: 'الملف فارغ أو تعذّرت قراءته من الهاتف، حاول اختياره مرة أخرى' };
  }
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return { url: null, error: `حجم الملف كبير جداً (الحد الأقصى ${MAX_UPLOAD_MB} ميجابايت)` };
  }

  const path = safePath(file, prefix);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type || 'application/octet-stream',
  });

  if (error) {
    return { url: null, error: error.message || 'فشل رفع الملف، تحقق من الاتصال بالإنترنت' };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};