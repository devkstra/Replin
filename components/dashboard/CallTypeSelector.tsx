"use client";

import { PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type CallTypeSelectorProps = {
  selectedType: string;
  onTypeChange: (type: string) => void;
};

export default function CallTypeSelector({ selectedType, onTypeChange }: CallTypeSelectorProps) {
  return (
    <Tabs 
      defaultValue={selectedType}
      onValueChange={onTypeChange}
      className="w-fit"
    >
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="inbound" className="flex items-center gap-2 px-4">
          <PhoneIncoming className={cn(
            "h-4 w-4",
            selectedType === "inbound" ? "text-primary" : "text-muted-foreground"
          )} />
          Inbound
        </TabsTrigger>
        <TabsTrigger 
          value="outbound" 
          className="flex items-center gap-2 px-4 relative cursor-not-allowed opacity-50"
          disabled
        >
          <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />
          <span>Outbound</span>
          <span className="absolute -top-2 -right-2 bg-muted text-[10px] px-1.5 py-0.5 rounded-full text-muted-foreground">
            Soon
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}