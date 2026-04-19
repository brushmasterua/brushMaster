"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Button } from "../ui/button";
import {
  ArrowRight,
  User,
  ShoppingCart,
  PaintbrushVertical,
} from "lucide-react";
import { useTotalItems, useTotalPrice } from "@/store/cart";
import Link from "next/link";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();

  return (
    <header
      className={cn(
        "border-b bg-white/80 backdrop-blur mb-8 sticky top-0 z-50", 
        className
      )}
    >
      <Container className="flex items-center justify-between py-3 gap-2">

        <Link href="/" className="flex items-center gap-2 min-w-0">
          <PaintbrushVertical className="text-[#f97316] w-8 h-8 shrink-0" />

          <div className="leading-tight min-w-0">
            <h1 className="text-xl md:text-2xl font-black truncate">
              Brush<span className="text-[#f97316]">Master</span>
            </h1>

            <div className="flex items-center gap-1">
              <hr className="flex-1 border-gray-300" />
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Brushes for walls
              </p>
              <hr className="flex-1 border-gray-300" />
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">

          {/* <Button
            variant="outline"
            className="flex items-center gap-1 px-2 sm:px-3 cursor-pointer"
          >
            <User size={16} />
            <span className="hidden sm:inline">Ввійти</span>
          </Button> */}

          <Link href="/cart">
            <Button className="group relative flex items-center px-3 sm:px-4 cursor-pointer">
              <b className="inline">
                {totalPrice.toLocaleString()} ₴
              </b>

              <span className="h-5 w-[1px] bg-white/30 mx-2 block" />

              <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0" >
                <ShoppingCart className="w-4 h-4" />
                <b className="text-xs sm:text-sm">{totalItems}</b>
              </div>

              <ArrowRight className="hidden md:block w-5 absolute right-3 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
            </Button>
          </Link>

        </div>
      </Container>
    </header>
  );
};