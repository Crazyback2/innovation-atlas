"use client";

import { useEffect, useRef, useState } from "react";
import { SECTORS } from "@/src/data/concepts";
import {
  getQuadrantLabel,
  getSortLabel,
  QUADRANT_OPTIONS,
  SORT_OPTIONS,
  type Filters,
} from "@/app/lib/filters";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function SearchIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="4.25" cy="4.25" r="3.25" stroke="currentColor" strokeWidth="1" />
      <path d="M7 7L9.5 9.5" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2.5 4.5L6.5 8.5L10.5 4.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

const PILL_BUTTON_BASE =
  "flex h-[29px] w-full items-center gap-[10px] border border-fg-primary px-[10px] pb-[7px] pt-[8px] transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-fg-primary";

function pillButtonClass(active: boolean): string {
  return active
    ? `${PILL_BUTTON_BASE} bg-fg-primary text-bg-elevated`
    : `${PILL_BUTTON_BASE} bg-bg-elevated text-fg-primary`;
}

function PillDivider({ active }: { active: boolean }) {
  return (
    <span
      className={`h-[13px] w-px shrink-0 ${active ? "bg-bg-elevated" : "bg-fg-primary"}`}
      aria-hidden="true"
    />
  );
}

function usePillDropdown() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const active = open || hovered;

  function close() {
    setOpen(false);
    buttonRef.current?.blur();
  }

  function toggle() {
    setOpen((v) => !v);
  }

  return {
    open,
    active,
    buttonRef,
    close,
    toggle,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, onClose]);
}

function DropdownPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute left-0 top-[calc(100%+4px)] z-20 border border-fg-primary bg-bg-elevated ${className}`}
    >
      {children}
    </div>
  );
}

function DropdownOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full px-[10px] py-[6px] text-left font-mono text-metadata leading-normal whitespace-nowrap transition-colors hover:bg-fg-primary hover:text-bg-elevated ${
        selected ? "bg-accent-primary text-fg-primary" : "text-fg-primary"
      }`}
    >
      {label}
    </button>
  );
}

function SectorDropdown({
  value,
  onChange,
}: {
  value: Filters["sector"];
  onChange: (sector: Filters["sector"]) => void;
}) {
  const { open, active, buttonRef, close, toggle, onMouseEnter, onMouseLeave } =
    usePillDropdown();
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, close);

  const display = value === "all" ? "TUTTI" : value;

  function select(sector: Filters["sector"]) {
    onChange(sector);
    close();
  }

  return (
    <div ref={ref} className="relative w-[143px] shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={pillButtonClass(active)}
      >
        <span className="shrink-0 font-mono text-metadata uppercase leading-normal">
          SETTORE
        </span>
        <PillDivider active={active} />
        <span className="min-w-0 flex-1 truncate font-mono text-metadata uppercase leading-normal text-left">
          {display}
        </span>
        <ChevronDown />
      </button>
      {open && (
        <DropdownPanel className="max-h-[280px] w-[220px] overflow-y-auto">
          <DropdownOption
            label="Tutti"
            selected={value === "all"}
            onSelect={() => select("all")}
          />
          {SECTORS.map((sector) => (
            <DropdownOption
              key={sector}
              label={sector}
              selected={value === sector}
              onSelect={() => select(sector)}
            />
          ))}
        </DropdownPanel>
      )}
    </div>
  );
}

function QuadrantDropdown({
  value,
  onChange,
}: {
  value: Filters["quadrant"];
  onChange: (quadrant: Filters["quadrant"]) => void;
}) {
  const { open, active, buttonRef, close, toggle, onMouseEnter, onMouseLeave } =
    usePillDropdown();
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, close);

  const display = value === "all" ? "TUTTI" : getQuadrantLabel(value).toUpperCase();

  function select(quadrant: Filters["quadrant"]) {
    onChange(quadrant);
    close();
  }

  return (
    <div ref={ref} className="relative w-[156px] shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={pillButtonClass(active)}
      >
        <span className="shrink-0 font-mono text-metadata uppercase leading-normal">
          QUADRANTE
        </span>
        <PillDivider active={active} />
        <span className="min-w-0 flex-1 truncate font-mono text-metadata uppercase leading-normal text-left">
          {display}
        </span>
        <ChevronDown />
      </button>
      {open && (
        <DropdownPanel className="w-[220px]">
          {QUADRANT_OPTIONS.map((option) => (
            <DropdownOption
              key={option.value}
              label={option.label}
              selected={value === option.value}
              onSelect={() => select(option.value)}
            />
          ))}
        </DropdownPanel>
      )}
    </div>
  );
}

function RangePopover({
  label,
  range,
  width,
  onChange,
}: {
  label: string;
  range: [number, number];
  width: number;
  onChange: (range: [number, number]) => void;
}) {
  const { open, active, buttonRef, close, toggle, onMouseEnter, onMouseLeave } =
    usePillDropdown();
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, close);

  const display = `${range[0]} - ${range[1]}`;

  function clamp(value: number): number {
    return Math.min(100, Math.max(0, value));
  }

  function handleMinChange(raw: string) {
    const parsed = clamp(Number(raw) || 0);
    onChange([Math.min(parsed, range[1]), range[1]]);
  }

  function handleMaxChange(raw: string) {
    const parsed = clamp(Number(raw) || 0);
    onChange([range[0], Math.max(parsed, range[0])]);
  }

  return (
    <div ref={ref} className="relative shrink-0" style={{ width }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={pillButtonClass(active)}
      >
        <span className="shrink-0 font-mono text-metadata uppercase leading-normal">
          {label}
        </span>
        <PillDivider active={active} />
        <span className="min-w-0 flex-1 truncate font-mono text-metadata leading-normal text-left">
          {display}
        </span>
        <ChevronDown />
      </button>
      {open && (
        <DropdownPanel className="w-full min-w-[137px] p-[10px]">
          <div className="flex items-center gap-[8px]">
            <label className="flex flex-1 flex-col gap-[4px]">
              <span className="font-mono text-metadata uppercase text-fg-primary leading-normal">
                Min
              </span>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={range[0]}
                onChange={(e) => handleMinChange(e.target.value)}
                className="h-[29px] w-full border border-fg-primary bg-bg-elevated px-[8px] font-mono text-metadata text-fg-primary leading-normal outline-none"
              />
            </label>
            <label className="flex flex-1 flex-col gap-[4px]">
              <span className="font-mono text-metadata uppercase text-fg-primary leading-normal">
                Max
              </span>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={range[1]}
                onChange={(e) => handleMaxChange(e.target.value)}
                className="h-[29px] w-full border border-fg-primary bg-bg-elevated px-[8px] font-mono text-metadata text-fg-primary leading-normal outline-none"
              />
            </label>
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: Filters["sort"];
  onChange: (sort: Filters["sort"]) => void;
}) {
  const { open, active, buttonRef, close, toggle, onMouseEnter, onMouseLeave } =
    usePillDropdown();
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, close);

  function select(sort: Filters["sort"]) {
    onChange(sort);
    close();
  }

  return (
    <div ref={ref} className="relative w-[115px] shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={pillButtonClass(active)}
      >
        <span className="min-w-0 flex-1 truncate font-mono text-metadata leading-normal text-left">
          {getSortLabel(value)}
        </span>
        <ChevronDown />
      </button>
      {open && (
        <DropdownPanel className="w-[180px] right-0 left-auto">
          {SORT_OPTIONS.map((option) => (
            <DropdownOption
              key={option.value}
              label={option.label}
              selected={value === option.value}
              onSelect={() => select(option.value)}
            />
          ))}
        </DropdownPanel>
      )}
    </div>
  );
}

export default function FilterToolbar({ filters, onChange }: Props) {
  return (
    <div className="mx-auto flex h-[59px] w-[1263px] items-center gap-[14px] border border-fg-primary bg-bg-elevated px-[15px]">
      {/* Search — 247 px */}
      <label className="flex h-[29px] w-[247px] shrink-0 items-center gap-[8px] border border-fg-primary bg-bg-elevated pb-[7px] pl-[14px] pr-[10px] pt-[8px]">
        <SearchIcon />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Cerca per nome, autore o tag…"
          className="min-w-0 flex-1 bg-transparent font-mono text-metadata text-fg-primary leading-normal outline-none placeholder:text-fg-primary"
        />
      </label>

      <SectorDropdown
        value={filters.sector}
        onChange={(sector) => onChange({ ...filters, sector })}
      />

      <QuadrantDropdown
        value={filters.quadrant}
        onChange={(quadrant) => onChange({ ...filters, quadrant })}
      />

      <RangePopover
        label="CFML"
        range={filters.cfmlRange}
        width={137}
        onChange={(cfmlRange) => onChange({ ...filters, cfmlRange })}
      />

      <RangePopover
        label="SP"
        range={filters.spRange}
        width={124}
        onChange={(spRange) => onChange({ ...filters, spRange })}
      />

      <div className="flex-1" aria-hidden="true" />

      <span className="shrink-0 font-mono text-metadata uppercase text-fg-primary leading-normal whitespace-nowrap">
        ORDINA PER
      </span>

      <SortDropdown
        value={filters.sort}
        onChange={(sort) => onChange({ ...filters, sort })}
      />
    </div>
  );
}
