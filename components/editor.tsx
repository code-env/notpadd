"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

import { useEffect, useState } from "react";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import { PartialBlock, BlockNoteEditor } from "@blocknote/core";
import { toast } from "sonner";

import { updateNote } from "@/actions/note";
import { useUploadThing } from "@/utils/uploadthing";

// Our <Editor> component we can reuse later
const Editor = ({
  noteId,
  initialContent,
}: {
  noteId: string;
  initialContent: string;
}) => {
  const [, setIsTyping] = useState(false);
  const [, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("image");

  const uploadFile = async (file: File) => {
    try {
      const files = [file];
      const imgRes = startUpload(files);
      const newImage = await imgRes;
      if (newImage) {
        const imageUrl = newImage[0].url;
        return imageUrl;
      } else {
        throw new Error("Image upload failed or returned empty URL.");
      }
    } catch (error: any) {
      console.log(error.message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile,
  });

  useEffect(() => {
    let typingTimer: NodeJS.Timeout;

    const handleInputChange = () => {
      setIsTyping(true);
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        const document = JSON.stringify(editor.document);
        const promise = updateNote(document, noteId);
        toast.promise(promise, {
          loading: "loading...",
          success: "Saved",
          error: "something went wrong.",
        }); //nothing
      }, 2000);
    };

    // Add event listener for keypress events
    window.addEventListener("keypress", handleInputChange);

    return () => {
      // Clean up the event listener
      window.removeEventListener("keypress", handleInputChange);
    };
  }, []);

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} theme="light" />;
};

export default Editor;
