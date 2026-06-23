
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetProductByUuidQuery } from "@/services/ecommerce";
import { X } from "lucide-react";
import Image from "next/image";

type OfferModalData = {
  uuid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ViewProductDetail = ({
  uuid,
  open,
  onOpenChange
}:OfferModalData) => {
   console.log("=> uuid:", uuid)
   const {data:singleProduct} = useGetProductByUuidQuery(uuid);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="group max-h-[calc(100dvh-2rem)] max-w-full gap-0 rounded-none border-none p-0 data-[state=closed]:slide-out-to-bottom-30 data-[state=open]:slide-in-from-bottom-30 max-lg:top-auto max-lg:bottom-0 max-lg:translate-y-0 sm:max-w-190 lg:max-w-117.5"
      >
        <div className="absolute -inset-e-px -top-px">
          <DialogClose asChild>
            <Button
              size="icon-sm"
              className="origin-top-right rounded-none transition-all duration-300 lg:scale-50 lg:opacity-0 lg:group-hover:scale-100 lg:group-hover:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
            >
              <X />
            </Button>
          </DialogClose>
        </div>
        <div className="h-full max-h-72.5 overflow-hidden max-lg:hidden">
          <Image
            width={500}
            height={500}
            src={singleProduct?.thumbnail as string}
            alt="Silhouette with headphones"
            className="block size-full object-contain"
          />
        </div>
        <div className="space-y-5 overflow-y-auto px-9 py-5 lg:px-15 lg:py-7">
          <div className="space-y-2.5">
            <DialogTitle className="text-center text-3xl font-medium">
              {singleProduct?.name}
            </DialogTitle>
             <DialogTitle className="text-center text-3xl font-bold text-red-500">
              {singleProduct?.priceOut}$
            </DialogTitle>
          </div>
         
          <DialogFooter>
            <DialogDescription className="text-center text-xs leading-relaxed border-accent-foreground">
              {singleProduct?.description}
            </DialogDescription>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ViewProductDetail };
