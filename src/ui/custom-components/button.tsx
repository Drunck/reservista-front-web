import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: string | undefined;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, ...attrs } = props;
  return (
    <button 
      ref={ref}
      className={clsx(
        "box-border flex items-center justify-center px-4 py-2 rounded-md text-sm",
        className,
        {
          "bg-black border border-black text-white hover:bg-[--dark-blue-1] text-nowrap transition active:shadow-[0px_0px_5px_0px_#333333] disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed": variant !== "outlined",
          "border border-black text-black hover:bg-[--dark-blue-1] hover:text-white text-nowrap transition active:shadow-[0px_0px_5px_0px_#333333] disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed": variant === "outlined",
        }
      )} 
      {...attrs}
    >
      {props.children}
    </button>
  );
});

Button.displayName = "Button";
