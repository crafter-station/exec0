"use client";

import type { ReactNode } from "react";
import { isValidElement, useContext, useLayoutEffect, useRef, useState } from "react";
import { StreamdownContext } from "streamdown";

interface ParagraphProps {
  children?: ReactNode;
  className?: string;
  node?: {
    tagName?: string;
    position?: {
      start?: { line?: number; column?: number };
      end?: { line?: number; column?: number };
    };
  };
}

export function StreamingParagraph({
  children,
  className,
  node,
  ...props
}: ParagraphProps) {
  const { mode } = useContext(StreamdownContext);

  const filtered = (Array.isArray(children) ? children : [children]).filter(
    (c) => c != null && c !== "",
  );
  if (filtered.length === 1 && isValidElement(filtered[0])) {
    const childNode = (filtered[0] as unknown as { props?: { node?: ParagraphProps["node"] } }).props?.node;
    const tagName = childNode?.tagName;
    if (tagName === "img") return <>{children}</>;
    if (
      tagName === "code" &&
      childNode?.position?.start?.line !== childNode?.position?.end?.line
    ) {
      return <>{children}</>;
    }
  }

  if (mode !== "streaming") {
    return (
      <p className={className} {...props}>
        {children}
      </p>
    );
  }

  return (
    <AnimatedP className={className} {...props}>
      {children}
    </AnimatedP>
  );
}

function AnimatedP({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const prevTextRef = useRef("");
  const [anim, setAnim] = useState<{
    stable: string;
    chunk: string;
    key: number;
    fullText: string;
  } | null>(null);

  const childArray = Array.isArray(children) ? children : [children];
  const lastChild = childArray[childArray.length - 1];
  const lastIsString = typeof lastChild === "string";

  useLayoutEffect(() => {
    if (!lastIsString) {
      prevTextRef.current = "";
      setAnim(null);
      return;
    }

    const prev = prevTextRef.current;
    const curr = lastChild;
    prevTextRef.current = curr;

    if (curr === prev) return;

    if (curr.startsWith(prev) && curr.length > prev.length) {
      setAnim((a) => ({
        stable: prev,
        chunk: curr.slice(prev.length),
        key: (a?.key ?? 0) + 1,
        fullText: curr,
      }));
    } else {
      setAnim((a) => ({
        stable: "",
        chunk: curr,
        key: (a?.key ?? 0) + 1,
        fullText: curr,
      }));
    }
  }, [lastChild, lastIsString]);

  const shouldAnimate =
    anim !== null && lastIsString && anim.fullText === lastChild;

  if (shouldAnimate) {
    return (
      <p {...props}>
        {childArray.slice(0, -1)}
        {anim.stable}
        <span key={anim.key} className="token-fade">
          {anim.chunk}
        </span>
      </p>
    );
  }

  return <p {...props}>{children}</p>;
}
