"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PATTERNS = {
  numbers: /^[0-9]$/,
  letters: /^[a-zA-Z]$/,
  both: /^[a-zA-Z0-9]$/,
};

// success dibuja su propio anillo en svg, así que no hay ring css aquí
const RING = {
  idle: "focus-visible:border-crimson focus-visible:ring-4 focus-visible:ring-crimson/15",
  success: "",
  error: "border-crimson bg-crimson-light/10 ring-4 ring-crimson/15 delay-150",
};

const SUCCESS = "#99B898";

// cell limita el ancho máximo; las casillas se encogen solas en pantallas angostas
const SIZES = {
  sm: {
    cell: "max-w-10",
    box: "rounded-lg",
    text: "text-base",
    caret: "h-5",
    gap: "gap-1.5",
    px: 40,
    radius: 8,
  },
  md: {
    cell: "max-w-14",
    box: "rounded-xl",
    text: "text-xl",
    caret: "h-6",
    gap: "gap-2",
    px: 48,
    radius: 12,
  },
  lg: {
    cell: "max-w-16",
    box: "rounded-2xl",
    text: "text-2xl",
    caret: "h-7",
    gap: "gap-2.5",
    px: 56,
    radius: 16,
  },
};

const SLOT_CLASS =
  "size-full border border-charcoal/15 bg-paper text-center font-medium text-transparent caret-transparent outline-none transition-[box-shadow,border-color,background-color] duration-200 selection:bg-transparent disabled:cursor-not-allowed disabled:opacity-50";

const ROLL_SPRING = { type: "spring", stiffness: 500, damping: 34 };
const CARET_SPRING = { type: "spring", stiffness: 500, damping: 40 };
const BLINK = {
  duration: 1.1,
  times: [0, 0.5, 0.5, 1],
  repeat: Infinity,
  ease: "linear",
};

const ROLL = {
  initial: { y: "110%" },
  exit: (cleared) => ({ y: cleared ? "110%" : "-110%" }),
};

const SHAKE = [0, -5, 4, -2, 0];

const toSlots = (code, length) =>
  Array.from({ length }, (_, i) => code[i] ?? "");

export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  type = "numbers",
  size = "md",
  status = "idle",
  mask = false,
  disabled,
  autoFocus,
  className,
  slotClassName,
  ...props
}) {
  const [uncontrolled, setUncontrolled] = useState(() =>
    toSlots(defaultValue, length),
  );
  const [cleared, setCleared] = useState(false);
  const [focused, setFocused] = useState(null);
  const [caretX, setCaretX] = useState(0);
  const inputs = useRef([]);
  const cells = useRef([]);
  // la casilla a la que el usuario se movió a propósito, para que un código completo solo cambie intencionalmente
  const editingAt = useRef(null);
  const reduceMotion = useReducedMotion();

  // con relleno, no con join: unir cerraría un hueco dejado por un backspace a mitad del código
  const slots =
    value === undefined
      ? Array.from({ length }, (_, i) => uncontrolled[i] ?? "")
      : toSlots(value, length);
  const numeric = type === "numbers";
  const scale = SIZES[size];
  const caretVisible = focused !== null && !slots[focused];

  const commit = (next) => {
    if (value === undefined) setUncontrolled(next);
    const code = next.join("");
    onChange?.(code);
    if (next.every(Boolean)) onComplete?.(code);
  };

  const setCharAt = (index, char) => {
    setCleared(!char);
    commit(slots.map((slot, i) => (i === index ? char : slot)));
  };

  const focusAt = (index) => {
    const input = inputs.current[Math.min(Math.max(index, 0), length - 1)];
    input?.focus();
    input?.select();
  };

  const fill = (index, chars) => {
    const room = Math.min(chars.length, length - index);
    const next = [...slots];
    chars.slice(0, room).forEach((char, i) => {
      next[index + i] = char;
    });
    setCleared(false);
    commit(next);
    editingAt.current = null;
    focusAt(index + room);
  };

  const handleChange = (index, raw) => {
    const chars = raw.split("").filter((char) => PATTERNS[type].test(char));
    if (!chars.length) return;

    // escribir en una casilla llena agrega, así que se conserva solo el carácter nuevo
    const typed =
      chars.length === 1
        ? chars[0]
        : chars.length === 2 && chars[0] === slots[index]
          ? chars[1]
          : null;

    if (typed === null) {
      // algo más largo llegó de golpe: un pegado o un autocompletado de SMS
      fill(index, chars);
      return;
    }

    if (slots.every(Boolean) && editingAt.current !== index) return;

    setCharAt(index, typed);
    editingAt.current = null;
    focusAt(index + 1);
  };

  const handleKeyDown = (index, event) => {
    const actions = {
      ArrowLeft: () => {
        editingAt.current = Math.max(index - 1, 0);
        focusAt(index - 1);
      },
      ArrowRight: () => {
        editingAt.current = Math.min(index + 1, length - 1);
        focusAt(index + 1);
      },
      Backspace: () => {
        if (slots[index]) {
          setCharAt(index, "");
        } else if (index > 0) {
          setCharAt(index - 1, "");
          focusAt(index - 1);
        }
      },
    };

    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const handlePaste = (index, event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .split("")
      .filter((char) => PATTERNS[type].test(char));
    if (pasted.length) fill(index, pasted);
  };

  // hacer clic después del primer hueco cae en el hueco, para que el código siga contiguo
  const handlePointerDown = (index, event) => {
    const firstEmpty = slots.findIndex((slot) => !slot);
    const target = firstEmpty === -1 ? index : Math.min(index, firstEmpty);
    editingAt.current = target;
    if (target === index) return;
    event.preventDefault();
    focusAt(target);
  };

  return (
    <div
      data-slot="otp-input"
      data-status={status}
      className={cn("relative flex w-full", className)}
      {...props}
    >
      <motion.div
        onFocus={(event) => {
          const index = inputs.current.indexOf(event.target);
          const cell = cells.current[index];
          setFocused(index);
          if (cell) setCaretX(cell.offsetLeft + cell.offsetWidth / 2);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(null);
          }
        }}
        animate={{
          x: status === "error" && !reduceMotion ? SHAKE : 0,
        }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        data-slot="otp-input-row"
        className={cn("relative flex w-full items-center", scale.gap)}
      >
        {slots.map((slot, index) => (
          <div
            key={index}
            ref={(el) => {
              cells.current[index] = el;
            }}
            data-slot="otp-input-cell"
            data-filled={Boolean(slot)}
            className={cn("relative aspect-square min-w-0 flex-1", scale.cell)}
          >
            <input
              ref={(el) => {
                inputs.current[index] = el;
              }}
              data-slot="otp-input-slot"
              data-filled={Boolean(slot)}
              value={slot}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onPointerDown={(event) => handlePointerDown(index, event)}
              onFocus={(event) => event.target.select()}
              type={mask ? "password" : "text"}
              inputMode={numeric ? "numeric" : "text"}
              autoCapitalize={numeric ? undefined : "characters"}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              autoFocus={autoFocus && index === 0}
              disabled={disabled}
              aria-label={`${numeric ? "Dígito" : "Carácter"} ${index + 1} de ${length}`}
              className={cn(
                SLOT_CLASS,
                scale.box,
                scale.text,
                RING[status],
                status === "idle" && slot && "border-charcoal/30 bg-white",
                slotClassName,
              )}
            />

            <AnimatePresence>
              {status === "success" && (
                <motion.svg
                  aria-hidden
                  data-slot="otp-input-ring"
                  viewBox={`0 0 ${scale.px} ${scale.px}`}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute inset-0 size-full"
                >
                  <motion.rect
                    x={1}
                    y={1}
                    width={scale.px - 2}
                    height={scale.px - 2}
                    rx={scale.radius - 1}
                    fill="none"
                    stroke={SUCCESS}
                    strokeWidth={2}
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                          duration: 0.45,
                          ease: "easeOut",
                          delay: 0.15 + index * 0.05,
                        }
                    }
                  />
                </motion.svg>
              )}
            </AnimatePresence>

            <span className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
              <AnimatePresence initial={false} custom={cleared}>
                {slot && (
                  <motion.span
                    key={slot}
                    custom={cleared}
                    variants={ROLL}
                    initial={reduceMotion ? false : "initial"}
                    animate={{ y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : "exit"}
                    transition={reduceMotion ? { duration: 0 } : ROLL_SPRING}
                    className={cn("font-semibold text-charcoal", scale.text)}
                  >
                    {mask ? "•" : slot}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </div>
        ))}

        {caretVisible && (
          <motion.span
            aria-hidden
            initial={false}
            animate={{ x: caretX - 1, y: "-50%", opacity: [1, 1, 0, 0] }}
            transition={{
              x: reduceMotion ? { duration: 0 } : CARET_SPRING,
              opacity: BLINK,
            }}
            className={cn(
              "pointer-events-none absolute left-0 top-1/2 w-0.5 rounded-full bg-crimson",
              scale.caret,
            )}
          />
        )}
      </motion.div>
    </div>
  );
}

export default OtpInput;