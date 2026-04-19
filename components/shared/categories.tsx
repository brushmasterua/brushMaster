"use client";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface Category {
  value: string;
  label: string;
}

interface Props {
  className?: string;
  onCategoryChange?: (category: string, index: number) => void;
  defaultValue?: string;
  cats?: Category[];
  value?: string; // Додано для контрольованого режиму
  onValueChange?: (value: string) => void; // Додано для контрольованого режиму
}

export const Categories: React.FC<Props> = ({ 
  className, 
  onCategoryChange,
  defaultValue = "all",
  cats,
  value: controlledValue,
  onValueChange,
}) => {
  // Показуємо скелетон поки немає даних
  if (!cats || cats.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
          {/* Відображаємо 6 скелетонів, як у вашому дизайні */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-11 w-20 rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = (value: string) => {
    if (!isControlled) {
      setInternalValue(value);
    }
    onValueChange?.(value);
    const index = cats.findIndex(cat => cat.value === value);
    onCategoryChange?.(value, index);
  };


  return (
    <Tabs 
  value={defaultValue}
  defaultValue={defaultValue}  // можна залишити або прибрати
  className={cn("w-full", className)}
  onValueChange={(value) => {
    const index = cats.findIndex(cat => cat.value === value);
    onCategoryChange?.(value, index);
  }}
>
      <TabsList className="bg-gray-50 gap-2 h-auto w-full justify-start overflow-x-auto flex-nowrap mb-3">
        {cats.map((cat) => (
          <TabsTrigger
            key={cat.value}
            value={cat.value}
            className={cn(
              "font-bold h-11 rounded-xl px-5 data-[state=active]:bg-white",
              "data-[state=active]:shadow-md data-[state=active]:text-primary",
              "text-gray-600 hover:text-primary cursor-pointer"
            )}
          >
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};