import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
  EditorContent,
  EditorProvider,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ListOrdered } from "lucide-react";
import { Type } from "lucide-react";
import { Heading2 } from "lucide-react";
import { UnderlineIcon } from "lucide-react";
import { Heading1 } from "lucide-react";
import { Heading3 } from "lucide-react";
import { ListIcon } from "lucide-react";
import { Italic } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Bold } from "lucide-react";
import React from "react";
import { useState } from "react";

const Editor = ({ value, setValue }) => {
  const [headings, setHeadings] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline
    ],
    content: value,
    onUpdate: (editor) => {
      setValue(editor.editor.getHTML());
    },
    editorProps: {
      attributes: {
        spellCheck: false,
        class:
          "editor p-[1rem] text-[1.45rem] min-h-[30vh] outline-none rounded-md bg-dark-300 bg-opacity-30 dark:bg-dark-800 dark:bg-opacity-80 dark:text-zinc-300 ease-in-out duration-300 focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 border border-transparent",
      },
    },
  });

  function getActiveText() {
    if (editor.isActive("heading", { level: 1 })) {
      return "Título 1";
    }
    else if (editor.isActive("heading", { level: 2 })) {
      return "Título 2";
    }
    else if (editor.isActive("heading", { level: 3 })) {
      return "Título 3";
    } 
    else if (editor.isActive("bulletList")) {
      return "Lista";
    } 
    else if (editor.isActive("orderedList")) {
      return "Lista ordenada";
    } 
    else {
      return "Parágrafo";
    }
  }
  return (
    <EditorContent editor={editor} className="w-full">
      {editor && (
        <>
          <BubbleMenu
            editor={editor}
            className=" dark:bg-zinc-900 p-[1rem] rounded-[.5rem] flex border dark:border-zinc-800"
          >
            <button
              type="button"
              onClick={() => setHeadings(!headings)}
              className="p-[.5rem] text-[1.3rem] dark:text-zinc-100 flex items-center gap-[.4rem] leading-none hover:bg-zinc-800 rounded-lg"
            >
              {getActiveText()}
              <ChevronDown
                className={`w-[1.4rem] h-[1.4rem]  duration-200 ${
                  headings ? "rotate-180" : ""
                }`}
              />
            </button>
            {headings && (
              <ul
                onMouseOver={(e) => e.stopPropagation()}
                onClick={() => setHeadings(false)}
                className="text-zinc-900 text-[1.3rem] dark:text-zinc-50 bg-zinc-900 absolute top-[105%] w-full left-0 z-[5] rounded-lg inter"
              >
                <li
                  onClick={() => editor.commands.toggleHeading({ level: 1 })}
                  className="flex gap-[.4rem] items-center hover:bg-zinc-800 p-[1rem] "
                >
                  <Heading1 className="w-[1.6rem] h-[1.6rem]" />
                  Título 1
                </li>
                <li
                  onClick={() => editor.commands.toggleHeading({ level: 2 })}
                  className="flex gap-[.4rem] items-center hover:bg-zinc-800 p-[1rem] "
                >
                  <Heading2 className="w-[1.6rem] h-[1.6rem]" />
                  Título 2
                </li>
                <li
                  onClick={() => editor.commands.toggleHeading({ level: 3 })}
                  className="flex gap-[.4rem] items-center hover:bg-zinc-800 p-[1rem] "
                >
                  <Heading3 className="w-[1.6rem] h-[1.6rem]" />
                  Título 3
                </li>
                <li
                  onClick={() => editor.commands.setParagraph()}
                  className="flex gap-[.4rem] items-center hover:bg-zinc-800 p-[1rem] "
                >
                  <Type className="w-[1.6rem] h-[1.6rem]" />
                  Parágrafo
                </li>
                <li
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className="flex gap-[.4rem] items-center hover:bg-zinc-800 p-[1rem] "
                >
                  <ListIcon className="w-[1.6rem] h-[1.6rem]" />
                  Lista
                </li>
                <li
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className="flex gap-[.4rem] items-center hover:bg-zinc-800 p-[1rem] "
                >
                  <ListOrdered className="w-[1.6rem] h-[1.6rem]" />
                  Lista numerada
                </li>
              </ul>
            )}
            <button
              onClick={() => editor.chain().toggleBold().run()}
              data-active={editor.isActive("bold")}
              className="dark:text-zinc-100 hover:bg-zinc-800 p-[.5rem] rounded-md data-[active=true]:bg-zinc-800"
            >
              <Bold className="w-[1.8rem] h-[1.8rem] " />
            </button>
            <button
              data-active={editor.isActive("italic")}
              onClick={() => editor.chain().toggleItalic().run()}
              className="dark:text-zinc-100 hover:bg-zinc-800 p-[.5rem] rounded-md data-[active=true]:bg-zinc-800"
            >
              <Italic className="w-[1.8rem] h-[1.8rem] " />
            </button>
            <button
              data-active={editor.isActive("underline")}
              onClick={() => editor.commands.toggleUnderline()}
              className="dark:text-zinc-100 hover:bg-zinc-800 p-[.5rem] rounded-md data-[active=true]:bg-zinc-800"
            >
              <UnderlineIcon className="w-[1.8rem] h-[1.8rem] " />
            </button>
          </BubbleMenu>
        </>
      )}
    </EditorContent>
  );
};

export default Editor;
