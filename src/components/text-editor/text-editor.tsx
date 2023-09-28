'use client'

import { useEditor, EditorContent, EditorContentProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
import Placeholder from '@tiptap/extension-placeholder'

import {
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'
import { Button } from '../ui/button'

type TextEditorProps = Omit<EditorContentProps, 'editor' | 'ref'> & {
  onChange?: (html: string) => void
}

export default function TextEditor({ onChange, ...props }: TextEditorProps) {
  const editor = useEditor({
    onUpdate: () => {
      const html = editor?.getHTML()
      if (html && typeof onChange === 'function') {
        onChange(html)
      }
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[4rem] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: props?.placeholder ?? 'Write something...',
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
    ],
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          icon={<Bold />}
          type="button"
          disabled={!editor.can().chain().focus().toggleBold().run()}
          variant={editor.isActive('bold') ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Button
          icon={<Italic />}
          type="button"
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          variant={editor.isActive('italic') ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Button
          icon={<Strikethrough />}
          type="button"
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          variant={editor.isActive('strike') ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <Button
          icon={<Eraser />}
          type="button"
          variant={'outline'}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        />
        <Button
          icon={<Heading1 />}
          type="button"
          variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <Button
          icon={<Heading2 />}
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <Button
          icon={<Heading3 />}
          type="button"
          variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <Button
          icon={<Heading4 />}
          type="button"
          variant={editor.isActive('heading', { level: 4 }) ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        />
        <Button
          icon={<Heading5 />}
          type="button"
          variant={editor.isActive('heading', { level: 5 }) ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        />
        <Button
          icon={<Heading6 />}
          type="button"
          variant={editor.isActive('heading', { level: 6 }) ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        />
        <Button
          icon={<List />}
          type="button"
          variant={editor.isActive('bulletList') ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <Button
          icon={<ListOrdered />}
          type="button"
          variant={editor.isActive('orderedList') ? 'secondary' : 'outline'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Button
          icon={<Undo />}
          type="button"
          variant={'outline'}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        />
        <Button
          icon={<Redo />}
          type="button"
          variant={'outline'}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        />
      </div>
      <EditorContent editor={editor} {...props} />
    </>
  )
}
