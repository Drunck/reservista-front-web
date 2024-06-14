import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";


type GallerySectionProps = {
  images: string[];
};

export default function GallerySection({ images }: GallerySectionProps) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 py-2 bg-white">
        {images.length > 0 ? (
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-40 h-40 col-span-1 cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openModal(index)}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg"
                  fill
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No images available</p>
        )}
      </div>
      <Dialog open={modalIsOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl md:min-h-screen flex justify-center items-center p-16">
          <Carousel
            opts={{
              align: "center",
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="m-0">
              {images.map((image, index) => (
                <div key={index} className="relative w-full h-[500px]">
                  <Image
                    src={image}
                    alt={`Carousel image ${index + 1}`}
                    className="w-full h-full object-contain"
                    fill
                  />
                </div>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  )
}
