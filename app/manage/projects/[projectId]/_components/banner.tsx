import { cn } from "@/lib/utils";
import { Article } from "@prisma/client";
import Image from "next/image";
import React from "react";
import TrashImage from "./trash-Image";
import ChangeImage from "./change-image";

const Banner = ({ article }: { article: Article }) => {
  return (
    <div className="relative h-80 w-full rounded-lg overflow-hidden group">
      <Image
        src={article.displayImage ? article.displayImage : "/placeholder.svg"}
        alt="Notpadd image placeholder"
        className="object-cover"
        fill
      />
      <div
        className={cn(
          "transition-all absolute h-full w-full opacity-100 group-hover:opacity-100 bg-black/10 flex items-center justify-center"
        )}
      >
        <TrashImage article={article} />
        <ChangeImage />
      </div>
    </div>
  );
};

export default Banner;
