import type { SVGProps } from "react";

export function LinkNestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 12.5l3-3 3 3" />
      <path d="M11.5 15.5v-9" />
      <path d="M5 11.5a7 7 0 1 0 14 0" />
      <path d="M2 11.5a10 10 0 1 0 20 0" />
    </svg>
  );
}
