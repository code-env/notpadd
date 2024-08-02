import { db } from "@/lib/db";
import { Article } from "@prisma/client";

import { NextResponse } from "next/server";

async function allArticles(articles: Article[]) {
  const newArticles = articles.map((article) => {
    return {
      ...article,
      content: JSON.parse(article.content!),
    };
  });

  return newArticles;
}

export async function GET(req: Request) {
  try {
    const { headers } = req;

    const next_notpadd_userId = headers.get("next_notpadd_userId");
    const next_notpadd_spaceId = headers.get("next_notpadd_spaceId");
    const get_only_private_articles = headers.get("get_only_private_articles");
    const get_only_public_articles = headers.get("get_only_public_articles");
    const get_all_articles = headers.get("get_all_articles");

    const spaceId = decryptBase64(next_notpadd_spaceId as string);
    const userId = decryptBase64(next_notpadd_userId as string);

    if (!userId && !spaceId) {
      return NextResponse.json(
        { message: "You are not authorized to view this page" },
        {
          status: 401,
        }
      );
    }

    const doesUserExist = await db.user.findFirst({
      where: {
        userId,
      },
    });

    //  console.log(doesUserExist);

    if (!doesUserExist) {
      return NextResponse.json(
        { message: "You are not authorized get this data" },
        {
          status: 401,
        }
      );
    }

    const doesSpaceExist = await db.space.findFirst({
      where: {
        id: spaceId,
      },
    });

    //console.log(doesSpaceExist);

    if (!doesSpaceExist) {
      return NextResponse.json(
        { message: "Sorry the spaceId is invalid, please create one" },
        { status: 401 }
      );
    }

    if (get_all_articles === "true") {
      const blogs = await db.article.findMany({
        where: {
          userId: doesUserExist.id,
          id: spaceId,
        },
      });

      const articles = await allArticles(blogs);

      if (!articles || articles.length === 0) {
        return NextResponse.json(
          { message: "No articles found, please create some" },
          {
            status: 404,
          }
        );
      }

      console.log("articles all", articles);
      return NextResponse.json(articles, { status: 200 });
    }

    if (
      get_only_private_articles === "true" &&
      get_only_public_articles === "true"
    ) {
      return NextResponse.json(
        {
          message:
            "You can't get both public and private as true use get all articles rather",
        },
        { status: 400 }
      );
    }

    if (get_only_private_articles === "true" && get_all_articles != "true") {
      const blogs = await db.article.findMany({
        where: {
          id: spaceId,
          userId: doesUserExist.id,
          isPublic: false,
        },
      });

      const articles = await allArticles(blogs);

      if (!articles || articles.length === 0) {
        return NextResponse.json(
          { message: "No articles found. please create some" },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(articles, { status: 200 });
    }

    if (get_only_public_articles === "true" && get_all_articles != "true") {
      const blogs = await db.article.findMany({
        where: {
          id: spaceId,
          userId: doesUserExist.id,
          isPublic: true,
        },
      });

      const articles = await allArticles(blogs);

      if (!articles || articles.length === 0) {
        return NextResponse.json(
          { message: "No articles found, please create some" },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(articles, { status: 200 });
    }

    return NextResponse.json(
      {
        message:
          "You are authorized to view this page but the header data you are sending may not be properly structured.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
