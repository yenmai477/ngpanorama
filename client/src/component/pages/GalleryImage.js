import React, { useCallback, useEffect, useState } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

import Spinner from "../layout/Spinner";

const GalleryImage = ({ loading, getPhotos, photos }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  useEffect(() => {
    getPhotos();
    //eslint-disable-next-line
  }, []);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  if (loading) {
    return <Spinner className="mt-5" />;
  }

  return (
    <div className="site-container animated fadeIn delay-1s">
      <div className="text-center mb-5">
        <h1 className="header-content animated fadeIn">NgPanorama Gallery</h1>
        <p>Beautiful panorama images created by us</p>
      </div>
      {!photos.length && (
        <p className="text-center mt-5 animated fadeIn">No images to display</p>
      )}
      <Gallery photos={photos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title,
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
};

export default GalleryImage;
