import React, { ChangeEvent, useEffect, useState } from 'react';
import ImagePreview from '../ImagePreview/imagePreview';
import './styles/styles.css';

export interface IImageUploadProps {
  height: number;
  imageUrl?: string;
  width: number;
  onChange(image: File): void;
}

/**
 * A control that allows a user to select an image and when it changes, calls
 * the on change callback.
 * @param height The height of the image preview.
 * @param imageUrl The optional default image url.
 * @param onChange Called when the image is changed.
 * @param width The width of the image preview.
 */
const ImageUpload = ({
  height,
  imageUrl,
  onChange,
  width
}: IImageUploadProps): JSX.Element => {
  // Component's local state.
  const [localImageUrl, setImageUrl] = useState(imageUrl || '');
  const [localImageName, setImageName] = useState(imageUrl || 'Choose File');

  /**
   * Is called when the user updates the image.
   * @param e The change event.
   */
  const onImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const newImageUrl: string = reader.result as string;
      setImageUrl(newImageUrl);
      setImageName(file.name);
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    /* Nothing to do here. */
  }, [imageUrl]);

  return (
    <div className='image-upload-container'>
      <label className='image-upload-title'>image</label>
      <label
        hidden={!localImageName || localImageName !== 'Choose File'}
        className='image-upload-title-alert'
      >
        *
      </label>
      <div className='image-upload-preview'>
        <div className='image-upload-file-input'>
          <div className='image-upload-file'>
            <input
              type='file'
              name='imageInput'
              id='imageInput'
              className='image-input'
              onChange={onImageChange}
              required={true}
            />
            <label className='image-browse-label' htmlFor='imageInput'>
              Browse
            </label>
            <label className='image-label' htmlFor='imageInput'>
              {localImageName || 'Choose File'}
            </label>
          </div>
        </div>
        <ImagePreview
          className='rounded'
          height={height}
          imageUrl={localImageUrl}
          width={width}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
