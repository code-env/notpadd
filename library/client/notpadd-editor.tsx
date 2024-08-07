"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { PartialBlock, BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { NotpaddEditorProps } from "../types";
import "@blocknote/mantine/style.css";

export default function NotpaddContent({ content, theme }: NotpaddEditorProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: content
      ? (JSON.parse(content) as PartialBlock[])
      : undefined,
  });

  return <BlockNoteView editor={editor} theme={theme} editable={false} />;
}
