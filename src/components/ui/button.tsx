// @ts-nocheck
"use client";

import {
  Button as NextButton,
  SlotsToClasses,
  Spinner,
  cn,
  extendVariants,
  tv,
} from "@nextui-org/react";

import { ComponentPropsWithoutRef, forwardRef } from "react";

export * from "@nextui-org/button";

// TODO: use tailwind-variants for custom component
// TODO: add slot variants
const ExtendedButton = extendVariants(NextButton, {
  defaultVariants: {
    color: "primary",
    variant: "secondary",
    size: "lg",
  },
  variants: {
    color: {},
    variant: {
      secondary: "border border-[#F59855]",
      primary: "bg-[#F59855]",
      tertiary: "bg-transparent !shadow-none border-none",
    },
    size: {
      full: "w-full h-12",
      lg: "text-xl",
      md: "text-md",
      sm: "text-sm",
    },
  },
});

const wrapper = tv({
  base: "",
  variants: {
    color: {
      primary: "",
      secondary: "",
      default: "",
      success: "",
      warning: "",
      danger: "",
    },
  },
});

type Props = ComponentPropsWithoutRef<typeof ExtendedButton> & {
  classNames?: SlotsToClasses<"base" | "wrapper">;
  isLoading?: boolean;
  onClick?: () => void;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      classNames,
      color = "primary",
      variant = "secondary",
      size = "lg",
      isLoading,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={wrapper({
          color,
          className: classNames?.wrapper,
        })}
      >
        <ExtendedButton
          {...props}
          color={color}
          variant={variant}
          spinner={<Spinner size="sm" color="primary" />}
          isLoading={isLoading}
          size={size}
          className={cn(
            "rounded-none px-4 font-medium data-[pressed=true]:scale-100",
            classNames?.base,
            className,
          )}
          ref={ref}
          onClick={onClick}
        />
      </div>
    );
  },
);
Button.displayName = "Button";
