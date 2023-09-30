'use client'

import { useEditor, EditorContent, EditorContentProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { forwardRef, useImperativeHandle } from 'react'
import Toolbar from './components/toolbar'
import { Heading } from './components/heading'

type TextEditorProps = Omit<EditorContentProps, 'editor' | 'ref'> & {
  onChange?: (html: string) => void
}

const TextEditor = forwardRef(function TextEditor({ onChange, ...props }: TextEditorProps, ref) {
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
      Heading,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: props?.placeholder ?? 'Write something...',
      }),
      StarterKit.configure({
        heading: false,
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
          keepMarks: true,
          keepAttributes: true,
        },
      }),
    ],
  })

  useImperativeHandle(ref, () => {
    return { editor }
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <EditorContent editor={editor} {...props} />
      {editor ? <Toolbar editor={editor} /> : null}
    </>
  )
})

export default TextEditor
