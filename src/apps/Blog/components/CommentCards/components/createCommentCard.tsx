import React, { ChangeEvent, FormEvent, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import uuid from 'uuid';
import {
  BasicTextArea,
  CollapsibleCard,
  ImagePreview,
} from '../../../../../components';
import './styles/styles.css';

interface ICreateCommentCardProps {
  postUUID: string;
  userInfo: IUser;
  onSaveCallback: (comment: IComment, postUUID: string) => Promise<void>;
}

/**
 * A component that allows a user to create a comment.
 * @param postUUID The uuid of the post the comment is being created for.
 * @param userInfo The user's info.
 * @param onSaveCallback Called when the submit button is clicked.
 */
const CreateCommentCard = ({
  postUUID,
  userInfo,
  onSaveCallback,
}: ICreateCommentCardProps): JSX.Element => {
  const [text, setComment] = useState('');
  const [disable, setDisable] = useState(true);

  /**
   * Sets the comment value when the rich text editor
   * is updated.
   * @param value The rich text value.
   */
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setComment(e.target.value);
    setDisable(e.target.value === '');
  };

  /**
   * Saves the comment to the database and updates state.
   * @param e The form event.
   */
  const saveComment = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newComment: IComment = {
      createdAt: new Date(),
      text,
      uuid: uuid(),
      visitor: undefined,
    };
    await onSaveCallback(newComment, postUUID);
    setComment('');
  };

  return (
    <CollapsibleCard title='Leave a comment'>
      <div className='comment-card-header'>
        <div className='comment-card-image'>
          <ImagePreview
            className='comment-card-avatar'
            height={50}
            imageUrl={userInfo.avatarUrl || ''}
            width={50}
          />
        </div>
        <div className='comment-card-info'>
          <div className='comment-card-title'>{userInfo.username}</div>
        </div>
      </div>
      <div className='comment-card-body'>
        <form onSubmit={saveComment} className='comment-card-form'>
          <div className='comment-card-text-input'>
            <BasicTextArea
              className='comment-card-text-area'
              labelName=''
              inputValue={text}
              textAreaSize={5}
              onChange={handleCommentChange}
            />
          </div>
          <button type='submit' className='shared-button' disabled={disable}>
            Submit
          </button>
        </form>
      </div>
    </CollapsibleCard>
  );
};

export default CreateCommentCard;
