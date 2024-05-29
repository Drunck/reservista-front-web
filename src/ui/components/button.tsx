import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
}

export function Button(props: ButtonProps) {
  const { className, ...attrs } = props;
  return (
    <button className={`${className} flex items-center justify-center bg-black text-white hover:bg-[--dark-blue-1] transition active:shadow-[0px_0px_5px_0px_#333333] disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed`} {...attrs}>
      {props.children}
    </button>
  )
}
