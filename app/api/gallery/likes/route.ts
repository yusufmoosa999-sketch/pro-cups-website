import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const allowedImages = [
  "gallery1",
  "gallery2",
  "gallery3",
  "gallery4",
  "gallery5",
  "gallery6",
  "gallery7",
  "gallery8",
];

const COOKIE_NAME = "pro_cups_gallery_visitor";

function isValidImage(imageKey: string) {
  return allowedImages.includes(imageKey);
}

function createVisitorId() {
  return crypto.randomUUID();
}

async function getOrCreateVisitorId() {
  const cookieStore = await cookies();

  const existingVisitor = cookieStore.get(COOKIE_NAME)?.value;

  if (existingVisitor) {
    return {
      visitorId: existingVisitor,
      isNew: false,
    };
  }

  return {
    visitorId: createVisitorId(),
    isNew: true,
  };
}

function setVisitorCookie(
  response: NextResponse,
  visitorId: string
) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: visitorId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
  });

  return response;
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Returns:
| - Global like count for every image
| - Whether THIS visitor has liked each image
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const { visitorId, isNew } =
      await getOrCreateVisitorId();

    const { data: voteRows, error } = await supabase
      .from("gallery_like_votes")
      .select("image_key, visitor_id");

    if (error) {
      console.error(
        "Gallery likes GET error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load gallery likes.",
        },
        { status: 500 }
      );
    }

    const likes: Record<string, number> = {};
    const likedByMe: Record<string, boolean> = {};

    for (const image of allowedImages) {
      likes[image] = 0;
      likedByMe[image] = false;
    }

    for (const row of voteRows ?? []) {
      if (!isValidImage(row.image_key)) {
        continue;
      }

      likes[row.image_key] += 1;

      if (row.visitor_id === visitorId) {
        likedByMe[row.image_key] = true;
      }
    }

    const response = NextResponse.json({
      success: true,
      likes,
      likedByMe,
    });

    if (isNew) {
      setVisitorCookie(response, visitorId);
    }

    return response;
  } catch (error) {
    console.error(
      "Gallery likes GET request error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load gallery likes.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Like or unlike a specific gallery image.
|
| The unique database constraint prevents duplicate likes
| from the same visitor.
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const imageKey = body?.imageKey;
    const action = body?.action;

    if (
      typeof imageKey !== "string" ||
      !isValidImage(imageKey)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid gallery image.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "like" &&
      action !== "unlike"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid like action.",
        },
        { status: 400 }
      );
    }

    const { visitorId, isNew } =
      await getOrCreateVisitorId();

    /*
    |--------------------------------------------------------------------------
    | LIKE
    |--------------------------------------------------------------------------
    */

    if (action === "like") {
      const { error } = await supabase
        .from("gallery_like_votes")
        .insert({
          image_key: imageKey,
          visitor_id: visitorId,
        });

      /*
      Duplicate likes are harmless.
      The unique constraint prevents them.
      */

      if (
        error &&
        error.code !== "23505"
      ) {
        console.error(
          "Gallery like insert error:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            error: "Unable to like image.",
          },
          { status: 500 }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | UNLIKE
    |--------------------------------------------------------------------------
    */

    if (action === "unlike") {
      const { error } = await supabase
        .from("gallery_like_votes")
        .delete()
        .eq("image_key", imageKey)
        .eq("visitor_id", visitorId);

      if (error) {
        console.error(
          "Gallery unlike error:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            error: "Unable to remove like.",
          },
          { status: 500 }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | GET NEW TOTAL
    |--------------------------------------------------------------------------
    */

    const { count, error: countError } =
      await supabase
        .from("gallery_like_votes")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("image_key", imageKey);

    if (countError) {
      console.error(
        "Gallery like count error:",
        countError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to get updated like count.",
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      imageKey,
      likeCount: count ?? 0,
      liked:
        action === "like",
    });

    /*
    |--------------------------------------------------------------------------
    | SAVE ANONYMOUS VISITOR COOKIE
    |--------------------------------------------------------------------------
    */

    if (isNew) {
      setVisitorCookie(
        response,
        visitorId
      );
    }

    return response;
  } catch (error) {
    console.error(
      "Gallery like request error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request.",
      },
      { status: 400 }
    );
  }
}