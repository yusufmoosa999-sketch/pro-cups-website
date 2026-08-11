"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Maximize2,
} from "lucide-react";

const gallery = [
  {
    src: "/images/gallery/gallery1.jpg",
    title: "Fresh On Boundary",
    category: "Premium Café Branding",
  },
  {
    src: "/images/gallery/gallery2.jpg",
    title: "Hannah Bear",
    category: "Custom Celebration Cup",
  },
  {
    src: "/images/gallery/gallery3.jpg",
    title: "Hayaat",
    category: "Custom Events Cup",
  },
  {
    src: "/images/gallery/gallery4.jpg",
    title: "Peppe Pistacchio",
    category: "Premium Coffee Branding",
  },
  {
    src: "/images/gallery/gallery5.jpg",
    title: "Polar Ice Cream",
    category: "Food & Beverage Branding",
  },
  {
    src: "/images/gallery/gallery6.jpg",
    title: "Custom Cup Collection",
    category: "Custom Printed Cups",
  },
  {
    src: "/images/gallery/gallery7.jpg",
    title: "Roma Café",
    category: "Café Branding",
  },
  {
    src: "/images/gallery/gallery8.jpg",
    title: "ZA Coffee",
    category: "Coffee Branding",
  },
];

export default function GalleryClient() {
  const [selected, setSelected] = useState<number | null>(null);

  const [likes, setLikes] = useState<Record<string, number>>({});

  const [likedByMe, setLikedByMe] = useState<
    Record<string, boolean>
  >({});

  const [loadingLikes, setLoadingLikes] = useState(true);

  const [processingLike, setProcessingLike] =
    useState<string | null>(null);

  const [touchStartX, setTouchStartX] =
    useState<number | null>(null);

  const [touchEndX, setTouchEndX] =
    useState<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD LIKES FROM SERVER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadLikes() {
      try {
        const response = await fetch(
          "/api/gallery/likes",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Unable to load gallery likes."
          );
        }

        setLikes(data.likes || {});
        setLikedByMe(data.likedByMe || {});
      } catch (error) {
        console.error(
          "Unable to load gallery likes:",
          error
        );
      } finally {
        setLoadingLikes(false);
      }
    }

    loadLikes();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LIKE / UNLIKE
  |--------------------------------------------------------------------------
  */

  async function toggleLike(
    event: React.MouseEvent,
    imageIndex: number
  ) {
    event.stopPropagation();

    const imageKey = `gallery${imageIndex + 1}`;

    /*
     * Prevent multiple requests for the same image
     */

    if (processingLike === imageKey) {
      return;
    }

    const currentlyLiked =
      likedByMe[imageKey] === true;

    const action = currentlyLiked
      ? "unlike"
      : "like";

    setProcessingLike(imageKey);

    /*
     * Optimistic UI
     *
     * The heart changes immediately so the site feels
     * responsive while the database request is happening.
     */

    setLikedByMe((previous) => ({
      ...previous,
      [imageKey]: !currentlyLiked,
    }));

    setLikes((previous) => ({
      ...previous,
      [imageKey]: Math.max(
        (previous[imageKey] ?? 0) +
          (currentlyLiked ? -1 : 1),
        0
      ),
    }));

    try {
      const response = await fetch(
        "/api/gallery/likes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageKey,
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to update gallery like."
        );
      }

      /*
       * Replace the optimistic count with the
       * real database count.
       */

      setLikes((previous) => ({
        ...previous,
        [imageKey]: data.likeCount ?? 0,
      }));

      setLikedByMe((previous) => ({
        ...previous,
        [imageKey]:
          data.liked === true,
      }));
    } catch (error) {
      console.error(
        "Gallery like error:",
        error
      );

      /*
       * Roll back the optimistic change
       * if the request failed.
       */

      setLikedByMe((previous) => ({
        ...previous,
        [imageKey]: currentlyLiked,
      }));

      setLikes((previous) => ({
        ...previous,
        [imageKey]: Math.max(
          (previous[imageKey] ?? 0) +
            (currentlyLiked ? 1 : -1),
          0
        ),
      }));
    } finally {
      setProcessingLike(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN / CLOSE
  |--------------------------------------------------------------------------
  */

  function openImage(index: number) {
    setSelected(index);
  }

  function closeLightbox() {
    setSelected(null);
  }

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS / NEXT
  |--------------------------------------------------------------------------
  */

  function showPrevious() {
    if (selected === null) {
      return;
    }

    setSelected(
      selected === 0
        ? gallery.length - 1
        : selected - 1
    );
  }

  function showNext() {
    if (selected === null) {
      return;
    }

    setSelected(
      selected === gallery.length - 1
        ? 0
        : selected + 1
    );
  }

  /*
  |--------------------------------------------------------------------------
  | KEYBOARD CONTROLS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (selected === null) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [selected]);

  /*
  |--------------------------------------------------------------------------
  | MOBILE SWIPE
  |--------------------------------------------------------------------------
  */

  function handleTouchStart(
    event: React.TouchEvent
  ) {
    setTouchStartX(
      event.targetTouches[0].clientX
    );

    setTouchEndX(null);
  }

  function handleTouchMove(
    event: React.TouchEvent
  ) {
    setTouchEndX(
      event.targetTouches[0].clientX
    );
  }

  function handleTouchEnd() {
    if (
      touchStartX === null ||
      touchEndX === null
    ) {
      return;
    }

    const distance =
      touchStartX - touchEndX;

    const minimumSwipeDistance = 50;

    if (
      Math.abs(distance) <
      minimumSwipeDistance
    ) {
      setTouchStartX(null);
      setTouchEndX(null);
      return;
    }

    if (distance > 0) {
      showNext();
    } else {
      showPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  }

  return (
    <>
      {/* =====================================================
          GALLERY GRID
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">

        <GalleryCard
          index={0}
          item={gallery[0]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="sm:col-span-2 lg:col-span-7 lg:h-[620px]"
        />

        <GalleryCard
          index={1}
          item={gallery[1]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="lg:col-span-5 lg:h-[300px]"
        />

        <GalleryCard
          index={2}
          item={gallery[2]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="lg:col-span-5 lg:h-[300px]"
        />

        <GalleryCard
          index={3}
          item={gallery[3]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="lg:col-span-7 lg:h-[470px]"
        />

        <GalleryCard
          index={4}
          item={gallery[4]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="lg:col-span-5 lg:h-[470px]"
        />

        <GalleryCard
          index={5}
          item={gallery[5]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="lg:col-span-4 lg:h-[500px]"
        />

        <GalleryCard
          index={6}
          item={gallery[6]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="lg:col-span-4 lg:h-[500px]"
        />

        <GalleryCard
          index={7}
          item={gallery[7]}
          likes={likes}
          likedByMe={likedByMe}
          loadingLikes={loadingLikes}
          processingLike={processingLike}
          onOpen={openImage}
          onLike={toggleLike}
          className="lg:col-span-4 lg:h-[500px]"
        />

      </div>


      {/* =====================================================
          GALLERY FOOTER
      ===================================================== */}

      <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-900">
            {gallery.length} projects
          </span>{" "}
          featured in our gallery
        </p>

        <button
          type="button"
          onClick={() => openImage(0)}
          className="group inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-green-600"
        >
          Explore the gallery

          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>

      </div>


      {/* =====================================================
          FULL SCREEN LIGHTBOX
      ===================================================== */}

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[#030712]/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={closeLightbox}
        >

          {/* TOP BAR */}

          <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8">

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
              {String(selected + 1).padStart(
                2,
                "0"
              )}

              <span className="mx-2 text-white/40">
                /
              </span>

              {String(gallery.length).padStart(
                2,
                "0"
              )}
            </div>


            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
            >
              <X size={22} />
            </button>

          </div>


          {/* PREVIOUS */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:flex sm:left-6"
          >
            <ChevronLeft size={28} />
          </button>


          {/* NEXT */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:flex sm:right-6"
          >
            <ChevronRight size={28} />
          </button>


          {/* MAIN IMAGE */}

          <div
            className="absolute inset-0 flex items-center justify-center px-5 pb-40 pt-24 sm:px-20 sm:pb-44"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="relative h-full w-full max-w-6xl">

              <Image
                src={gallery[selected].src}
                alt={gallery[selected].title}
                fill
                priority
                sizes="100vw"
                className="select-none object-contain"
              />

            </div>

          </div>


          {/* PROJECT INFORMATION */}

          <div
            className="absolute bottom-24 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 px-5 text-center sm:bottom-28"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-400 sm:text-xs">
              {gallery[selected].category}
            </p>

            <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              {gallery[selected].title}
            </h3>


            {/* LIKE BUTTON */}

            <button
              type="button"
              disabled={
                processingLike ===
                `gallery${selected + 1}`
              }
              onClick={(event) =>
                toggleLike(
                  event,
                  selected
                )
              }
              className={`mx-auto mt-4 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold backdrop-blur-md transition ${
                likedByMe[
                  `gallery${selected + 1}`
                ]
                  ? "bg-green-500 text-[#07111f]"
                  : "border border-white/10 bg-white/10 text-white hover:bg-white hover:text-black"
              } ${
                processingLike ===
                `gallery${selected + 1}`
                  ? "cursor-wait opacity-70"
                  : ""
              }`}
            >

              <Heart
                size={17}
                fill={
                  likedByMe[
                    `gallery${selected + 1}`
                  ]
                    ? "currentColor"
                    : "none"
                }
              />

              {likedByMe[
                `gallery${selected + 1}`
              ]
                ? "Liked"
                : "Like this cup"}

              <span className="ml-1 opacity-70">
                {likes[
                  `gallery${selected + 1}`
                ] ?? 0}
              </span>

            </button>

          </div>


          {/* THUMBNAILS */}

          <div
            className="absolute bottom-3 left-1/2 z-30 flex w-[calc(100%-30px)] max-w-3xl -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-xl sm:bottom-5"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {gallery.map(
              (item, index) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() =>
                    setSelected(index)
                  }
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg transition sm:h-14 sm:w-14 ${
                    selected === index
                      ? "ring-2 ring-green-400 ring-offset-2 ring-offset-transparent"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >

                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />

                </button>
              )
            )}

          </div>

        </div>
      )}
    </>
  );
}


/*
|--------------------------------------------------------------------------
| GALLERY CARD
|--------------------------------------------------------------------------
*/

function GalleryCard({
  index,
  item,
  likes,
  likedByMe,
  loadingLikes,
  processingLike,
  onOpen,
  onLike,
  className = "",
}: {
  index: number;

  item: {
    src: string;
    title: string;
    category: string;
  };

  likes: Record<string, number>;

  likedByMe: Record<string, boolean>;

  loadingLikes: boolean;

  processingLike: string | null;

  onOpen: (index: number) => void;

  onLike: (
    event: React.MouseEvent,
    index: number
  ) => void;

  className?: string;
}) {
  const imageKey =
    `gallery${index + 1}`;

  const liked =
    likedByMe[imageKey] === true;

  const isProcessing =
    processingLike === imageKey;

  return (
    <div
      className={`group relative h-[420px] overflow-hidden rounded-[32px] bg-slate-200 ${className}`}
    >

      {/* IMAGE */}

      <button
        type="button"
        onClick={() => onOpen(index)}
        className="absolute inset-0 h-full w-full cursor-zoom-in text-left"
        aria-label={`View ${item.title}`}
      >

        <Image
          src={item.src}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 transition duration-500 group-hover:from-black/90" />

      </button>


      {/* LIKE BUTTON */}

      <button
        type="button"
        disabled={isProcessing}
        onClick={(event) =>
          onLike(event, index)
        }
        aria-label={
          liked
            ? "Unlike this cup"
            : "Like this cup"
        }
        className={`absolute right-5 top-5 z-10 flex h-11 items-center gap-2 rounded-full px-4 backdrop-blur-md transition duration-300 ${
          liked
            ? "bg-green-500 text-[#07111f]"
            : "bg-black/25 text-white hover:bg-white hover:text-black"
        } ${
          isProcessing
            ? "cursor-wait opacity-70"
            : ""
        }`}
      >

        <Heart
          size={17}
          fill={
            liked
              ? "currentColor"
              : "none"
          }
        />

        <span className="text-sm font-bold">
          {loadingLikes
            ? "—"
            : likes[imageKey] ?? 0}
        </span>

      </button>


      {/* BOTTOM CONTENT */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-7">

        <div className="flex items-end justify-between gap-4">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-300 sm:text-xs">
              {item.category}
            </p>

            <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-white/60">
              Tap to explore
            </p>

          </div>


          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition duration-300 group-hover:bg-green-500 group-hover:text-[#07111f]">
            <Maximize2 size={17} />
          </div>

        </div>

      </div>

    </div>
  );
}