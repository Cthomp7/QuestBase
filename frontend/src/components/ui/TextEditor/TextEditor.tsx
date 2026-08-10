import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import styles from "./TextEditor.module.css"
import { Bold, Italic, List, ListOrdered } from "lucide-react"

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? styles.active : ""}
        >
          <Bold />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? styles.active : ""}
        >
          <Italic/>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? styles.active : ""}
        >
          <List/>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? styles.active : ""}
        >
          <ListOrdered/>
        </button>
      </div>
        <EditorContent editor={editor} />
    </div>
  )
}

export default TextEditor