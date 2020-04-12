import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  BasicInput,
  BasicRichTextbox,
  ImageUpload
} from '../../../../../../../components';
import './styles/styles.css';

interface IPostInputFormProps {
  post: IPost;
  onSubmit: (post: IPost, image: File) => Promise<void>;
}

/**
 * A component that allows a user to update or create a new post.
 * @param post The default post values to set the input too.
 * @param onSubmit Is called when the form is submitted.
 */
const PostInputForm = ({
  post,
  onSubmit
}: IPostInputFormProps): JSX.Element => {
  const [localPost, setPost] = useState(post);
  const [localImage, setImage] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  /**
   * Sets the input name and values in local state.
   * @param inputName The name of the property being updated.
   * @param inputValue The value of the property.
   */
  const setInputsAndValidate = (inputName: string, inputValue: any): void => {
    setPost({ ...localPost, [inputName]: inputValue });
    setIsDisabled(!localPost.title && !localPost.text && !localPost.imageUrl);
  };

  /**
   * Handles the change event when the value is updated on the input.
   * @param e The event when the change event occurs.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.persist();
    setInputsAndValidate(e.target.name, e.target.value);
  };

  /**
   * Handles the change event when the rich text editor is updated.
   * @param value The value within the text editor.
   */
  const handlePostChange = (value: string): void => {
    setInputsAndValidate('text', value);
  };

  /**
   * Handles when the user updates the image.
   * @param image The image assigned to the post.
   */
  const handleImageChange = (image: File): void => {
    setImage(image);
    setInputsAndValidate('image', 'new');
  };

  /**
   * Is called when the form submit button is clicked.  It either,
   * sends an edit or create request to the api.
   * @param e The form event.
   */
  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    await onSubmit(localPost, localImage);
  };

  useEffect(() => {
    /* No empty braces. */
  }, [localPost.imageUrl, localPost.text, localPost.title]);

  return (
    <div className='post-input-container'>
      <BasicInput
        className='post-input-form-input'
        labelName='title'
        inputValue={localPost.title}
        type='text'
        onChange={handleInputChange}
      />
      <ImageUpload
        imageUrl={localPost.imageUrl}
        onChange={handleImageChange}
        height={200}
        width={200}
      />
      <div
        style={{
          display: 'inline-block',
          height: '100%',
          marginBottom: 75,
          width: '100%'
        }}
      >
        <BasicRichTextbox
          height={400}
          inputValue={localPost.text}
          labelName='post'
          onChange={handlePostChange}
        />
      </div>
      <button
        className='shared-button'
        disabled={isDisabled}
        onClick={handleSubmit}
      >
        Save
      </button>
    </div>
  );
};

export default PostInputForm;
