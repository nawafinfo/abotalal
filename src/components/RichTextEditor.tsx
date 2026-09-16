import React, { useCallback } from 'react';
import { useEditor, EditorContent, Node, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  AlignRight, AlignCenter, AlignLeft, Undo2, Redo2, Minus, Highlighter, Info, AlertTriangle,
  CheckCircle2, Lightbulb, Upload, Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadToBucket } from '@/lib/uploadFile';

/** صندوق تنبيه ملوّن مع أيقونة */
const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return { type: { default: 'info' } };
  },
  parseHTML() {
    return [{ tag: 'div[data-callout]', getAttrs: (el) => ({ type: (el as HTMLElement).getAttribute('data-callout') || 'info' }) }];
  },
  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes.type || 'info';
    return ['div', mergeAttributes({ 'data-callout': type, class: `blog-callout blog-callout-${type}` }), 0];
  },
});

const COLORS = ['#e0b13c', '#22c55e', '#0ea5e9', '#ef4444', '#a855f7', '#f97316', '#0f172a', '#64748b'];

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, HTMLAttributes: { class: 'blog-link', rel: 'noopener noreferrer', target: '_blank' } } }),
      Image.configure({ HTMLAttributes: { class: 'blog-img' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Color,
      Table.configure({ resizable: false, HTMLAttributes: { class: 'blog-table' } }),
      TableRow, TableHeader, TableCell,
      Callout,
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'blog-content min-h-[260px] p-4 focus:outline-none', dir: 'rtl' } },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('أدخل الرابط', editor.getAttributes('link').href || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImageByUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('رابط الصورة', 'https://');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const uploadImage = async (file?: File | null) => {
    if (!file || !editor) return;
    const { url, error } = await uploadToBucket('portfolio', file, 'blog');
    if (error || !url) { toast.error(error || 'فشل رفع الصورة'); return; }
    editor.chain().focus().setImage({ src: url }).run();
  };

  const insertCallout = (type: string) => {
    editor?.chain().focus().insertContent({
      type: 'callout',
      attrs: { type },
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'اكتب نص التنبيه هنا...' }] }],
    }).run();
  };

  if (!editor) return null;

  const Btn: React.FC<{ on?: boolean; title: string; onClick: () => void; children: React.ReactNode }> = ({ on, title, onClick, children }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${on ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/40">
        <Btn title="عريض" on={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
        <Btn title="مائل" on={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
        <Btn title="تحته خط" on={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Btn>
        <Btn title="يتوسطه خط" on={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></Btn>
        <span className="w-px h-6 bg-border mx-1" />
        <Btn title="عنوان 1" on={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="w-4 h-4" /></Btn>
        <Btn title="عنوان 2" on={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></Btn>
        <Btn title="عنوان 3" on={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></Btn>
        <span className="w-px h-6 bg-border mx-1" />
        <Btn title="قائمة نقطية" on={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
        <Btn title="قائمة مرقمة" on={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
        <Btn title="اقتباس" on={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>
        <Btn title="كود" on={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="w-4 h-4" /></Btn>
        <Btn title="فاصل" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="w-4 h-4" /></Btn>
        <span className="w-px h-6 bg-border mx-1" />
        <Btn title="محاذاة يمين" on={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="w-4 h-4" /></Btn>
        <Btn title="توسيط" on={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="w-4 h-4" /></Btn>
        <Btn title="محاذاة يسار" on={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="w-4 h-4" /></Btn>
        <span className="w-px h-6 bg-border mx-1" />
        <Btn title="رابط" on={editor.isActive('link')} onClick={addLink}><LinkIcon className="w-4 h-4" /></Btn>
        <Btn title="صورة برابط" onClick={addImageByUrl}><ImageIcon className="w-4 h-4" /></Btn>
        <label className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted cursor-pointer" title="رفع صورة">
          <Upload className="w-4 h-4" />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
        </label>
        <Btn title="جدول" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="w-4 h-4" /></Btn>
        <Btn title="تظليل" on={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight({ color: '#fde68a' }).run()}><Highlighter className="w-4 h-4" /></Btn>
        <span className="w-px h-6 bg-border mx-1" />
        <Btn title="معلومة" onClick={() => insertCallout('info')}><Info className="w-4 h-4 text-sky-500" /></Btn>
        <Btn title="تحذير" onClick={() => insertCallout('warning')}><AlertTriangle className="w-4 h-4 text-amber-500" /></Btn>
        <Btn title="خطر" onClick={() => insertCallout('danger')}><AlertTriangle className="w-4 h-4 text-red-500" /></Btn>
        <Btn title="نجاح" onClick={() => insertCallout('success')}><CheckCircle2 className="w-4 h-4 text-emerald-500" /></Btn>
        <Btn title="نصيحة" onClick={() => insertCallout('tip')}><Lightbulb className="w-4 h-4 text-violet-500" /></Btn>
        <span className="w-px h-6 bg-border mx-1" />
        <div className="flex items-center gap-1">
          <Palette className="w-4 h-4 text-muted-foreground" />
          {COLORS.map(c => (
            <button key={c} type="button" title={c} onClick={() => editor.chain().focus().setColor(c).run()}
              className="w-5 h-5 rounded-full border border-border" style={{ background: c }} />
          ))}
        </div>
        <span className="w-px h-6 bg-border mx-1" />
        <Btn title="تراجع" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></Btn>
        <Btn title="إعادة" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></Btn>
      </div>
      <EditorContent editor={editor} />
      <div className="p-2 border-t border-border bg-muted/30 flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.commands.clearContent()}>مسح المحتوى</Button>
      </div>
    </div>
  );
};

export default RichTextEditor;
