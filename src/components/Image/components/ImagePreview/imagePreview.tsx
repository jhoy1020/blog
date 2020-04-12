import React from 'react';

interface IImagePreviewProps {
  className: string;
  height: string | number;
  imageUrl: string;
  width: string | number;
}

/**
 * A component that takes an image and displays that image with the given height
 * and width.
 * @param height The height of the image.
 * @param imageUrl The image to display.
 * @param width The width of the image.
 */
const ImagePreview = ({
  className,
  height,
  imageUrl,
  width
}: IImagePreviewProps): JSX.Element => {
  return (
    <img
      alt=''
      className={className}
      src={imageUrl}
      height={height}
      width={width}
    />
  );
};

export default ImagePreview;
