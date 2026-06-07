"use client";

import { useState } from "react";
import type { Concept } from "@/src/data/concepts";

interface Props {
  concept: Concept;
}

const PROFILE_BTN =
  "flex h-[29px] w-[108px] items-center justify-between border border-fg-primary bg-bg-elevated pl-[12px] pr-[10px] pt-[8px] pb-[7px] font-mono text-metadata text-fg-primary leading-none";

const BORDERED_BTN =
  "flex h-[29px] shrink-0 items-center gap-[10px] border border-fg-primary bg-bg-elevated px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-fg-primary leading-none";

const ROW_H = 273;
const COMMENT_W = 767;
const PROFILE_H = 119;

const COLOR_BAR_SEGMENTS = [
  { w: 34, color: "bg-fg-primary" },
  { w: 57, color: "bg-accent-secondary" },
  { w: 134, color: "bg-accent-primary" },
  { w: 238, color: "bg-accent-tertiary" },
] as const;

function MessageIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M1.5 1.5H9.5V7.5L6.5 5.5H1.5V1.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function splitAuthorName(name: string) {
  const spaceIndex = name.indexOf(" ");
  if (spaceIndex === -1) return { first: name, last: null };
  return {
    first: name.slice(0, spaceIndex),
    last: name.slice(spaceIndex + 1),
  };
}

export default function ConceptComments({ concept }: Props) {
  const [comment, setComment] = useState("");
  const { first: authorFirst, last: authorLast } = splitAuthorName(
    concept.author.name,
  );

  return (
    <div className="relative w-[1160px]">
      <div
        className="pointer-events-none absolute left-0 top-0 h-[64px] border-l border-dashed border-fg-primary"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-[64px] border-r border-dashed border-fg-primary"
        aria-hidden="true"
      />

      <div className="h-[64px]" aria-hidden="true" />

      <div className="relative flex h-[273px]">
        <div className="flex h-full w-[767px] shrink-0 flex-col border border-fg-primary bg-bg-elevated">
          <div className="flex items-center gap-[16px] px-[34px] pt-[31px]">
            <p className="shrink-0 font-mono text-metadata font-bold uppercase leading-normal text-fg-primary">
              Scrivi un commento
            </p>
            <div className="flex h-[14px] min-w-0 flex-1 items-stretch justify-end">
              <div className="flex h-full">
                {COLOR_BAR_SEGMENTS.map((seg) => (
                  <div
                    key={seg.w}
                    className={`h-full ${seg.color}`}
                    style={{ width: seg.w }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Fai sapere a @${concept.author.name} cosa pensi del suo progetto…`}
            className="mt-[16px] min-h-0 flex-1 resize-none border-none bg-transparent px-[34px] font-sans text-body leading-normal text-fg-primary outline-none placeholder:text-fg-primary"
          />

          <div className="flex justify-end px-[34px] pb-[32px]">
            <button type="button" className={BORDERED_BTN}>
              Condividi →
            </button>
          </div>
        </div>

        <div className="h-full w-[393px] shrink-0">
          <div className="flex h-[119px] items-center border border-l-0 border-fg-primary bg-bg-elevated px-[36px]">
            <div className="flex size-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-fg-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-header.svg"
                alt=""
                width={39}
                height={39}
                className="max-w-none brightness-0 invert"
                aria-hidden="true"
              />
            </div>

            <div className="ml-[12px] min-w-0 flex-1 text-left">
              <p className="font-sans text-body leading-normal text-fg-primary">
                {authorFirst}
                {authorLast && (
                  <>
                    <br />
                    {authorLast}
                  </>
                )}
              </p>
            </div>

            <div className="ml-auto flex shrink-0 flex-col gap-[9px]">
              <button type="button" className={PROFILE_BTN}>
                <span>Segui</span>
                <span aria-hidden="true">+</span>
              </button>
              <button type="button" className={PROFILE_BTN}>
                <span>Messaggio</span>
                <MessageIcon />
              </button>
            </div>
          </div>
        </div>

        <svg
          viewBox={`0 0 1160 ${ROW_H}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full text-fg-primary"
          aria-hidden="true"
        >
          <line
            x1={COMMENT_W}
            y1={ROW_H}
            x2={1160}
            y2={PROFILE_H}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mt-[8px]">
        <button
          type="button"
          className="flex h-[29px] items-center gap-[10px] border border-accent-secondary bg-bg-elevated px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-accent-secondary leading-none"
        >
          3 commenti ↓
        </button>
      </div>
    </div>
  );
}
