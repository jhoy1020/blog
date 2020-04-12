import React from 'react';
import { BasicButton } from '../../../../../../../components';
import './styles/styles.css';

interface ICommentCardProp {
  comment: IComment;
  onDeleteClick: (commentUUID: string) => void;
}

/**
 * Displays the comments information.
 * @param comment The comment to be displayed.
 * @param visitor The person that made the comment.
 * @param onDeleteClick Is called when the delete button is clicked.
 */
const CommentCard = ({
  comment,
  onDeleteClick
}: ICommentCardProp): JSX.Element => {
  const dateString = new Date(comment.createdAt).toDateString();

  /**
   * Called when the delete button is clicked.
   */
  const handleDeleteOnClick = (): void => {
    onDeleteClick(comment.uuid);
  };

  return (
    <div className='comment-card' key={comment.uuid}>
      <div className='comment-card-top'>
        <div className='comment-card-header'>
          <div className='comment-card-info'>
            <div className='comment-card-title'>
              {comment.visitor && comment.visitor.username}
            </div>
            <div className='comment-card-date'>{dateString}</div>
          </div>
        </div>
        <div className='comment-card-remove'>
          <BasicButton
            disabled={false}
            label='x'
            className='shared-button'
            onClick={handleDeleteOnClick}
          />
        </div>
      </div>
      <div className='comment-card-body'>
        <div>{comment.text}</div>
      </div>
    </div>
  );
};

export default CommentCard;
