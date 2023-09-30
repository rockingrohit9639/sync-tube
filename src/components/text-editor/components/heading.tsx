import BaseHeading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/react'

type Levels = 1 | 2 | 3 | 4 | 5 | 6

const classes: Record<Levels, string> = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-md',
}

export const Heading = BaseHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }).extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0]

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: classes[level],
      }),
      0,
    ]
  },
})
