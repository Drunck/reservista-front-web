"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { useRef, useState } from "react";
import { Button } from "./button";
import { ReponsiveDrawerDialogProps } from "@/lib/types";

export function ResponsiveDrawerDialog({ open, setOpen, ...props }: ReponsiveDrawerDialogProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" type="submit" option={props.triggerButtonOption} >{props.triggerButtonText}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-full md:max-w-xl">
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            {props.description && <DialogDescription>{props.description}</DialogDescription>}
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full" option={props.triggerButtonOption}>{props.triggerButtonText}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          {props.description && <DrawerDescription>{props.description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-4">
          {props.children}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button ref={buttonRef} option="outlined">{props.closeButtonText}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

