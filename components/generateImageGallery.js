import { useState, useEffect } from "react";
import Image from "./Image";

const useImageGallery = (galleryItems) => {
  const [imageGallery, setImageGallery] = useState({});
  const [mobileImageGallery, setMobileImageGallery] = useState({});

  useEffect(() => {
    if (galleryItems) {
      const structuredGallery = {};

      galleryItems.forEach((item, index) => {
        const key = `item-${index}`;
        const images = [];

        if (item.image1) images.push({ image: item.image1, name: "image1" });
        if (item.image2) images.push({ image: item.image2, name: "image2" });
        if (item.image3) images.push({ image: item.image3, name: "image3" });

        structuredGallery[key] = {
          images,
          height: item.height,
          index: index,
          item: item, // Preserve full item
        };
      });

      setImageGallery(structuredGallery);

      const galleryItemsProcessed = Object.values(structuredGallery).flatMap(
        (item) => {
          if (item.images.length === 3) {
            return [
              {
                images: [item.images[0], item.images[1]],
                height: item.height * 2,
                index: item.index,
                item: item.item,
              },
              {
                images: [item.images[2]],
                height: item.height * 3,
                index: item.index,
                item: item.item,
              },
            ];
          }
          return [item];
        }
      );

      const firstItem = galleryItemsProcessed.shift();

      if (!firstItem) {
        setMobileImageGallery({});
        return;
      }

      const pairs = galleryItemsProcessed.filter(
        (item) => item.images.length === 2
      );
      const singles = galleryItemsProcessed.filter(
        (item) => item.images.length === 1
      );

      const mobileGalleryOrdered = [firstItem];
      let lastType = firstItem.images.length === 1 ? "single" : "pair";

      while (pairs.length || singles.length) {
        if (lastType === "single" && pairs.length) {
          mobileGalleryOrdered.push(pairs.shift());
          lastType = "pair";
        } else if (lastType === "pair" && singles.length) {
          mobileGalleryOrdered.push(singles.shift());
          lastType = "single";
        } else {
          break;
        }
      }

      mobileGalleryOrdered.push(...pairs, ...singles);

      const mobileStructuredGallery = {};
      mobileGalleryOrdered.forEach((item, idx) => {
        mobileStructuredGallery[`item-${idx}`] = item;
      });

      setMobileImageGallery(mobileStructuredGallery);
    }
  }, [galleryItems]);

  return { imageGallery, mobileImageGallery };
};

const ImageGallery = ({ galleryItems, gap }) => {
  const { imageGallery, mobileImageGallery } = useImageGallery(galleryItems);

  return (
    <div>
      <div className="hidden sm:block">
        <GalleryRows gallery={imageGallery} gap={gap} />
      </div>
      <div className="block sm:hidden">
        <GalleryRows gallery={mobileImageGallery} gap={gap} />
      </div>
    </div>
  );
};

const GalleryRows = ({ gallery, gap }) => (
  <div
    className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto"
    style={{ gap: `${gap}px` }}
  >
    {Object.entries(gallery)
      .filter(([_, row]) => row.images && row.images.length > 0)
      .map(([key, row]) => (
        <div key={key} className="flex flex-row" style={{ gap: `${gap}px` }}>
          {row.images.map((image, idx) => (
            <Image
              key={idx}
              item={row.item}
              height={row.height}
              image={image.image}
              tinaName={image.name}
            />
          ))}
        </div>
      ))}
  </div>
);

export { ImageGallery };
export default useImageGallery;
