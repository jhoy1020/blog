import React from 'react';
import {
  BasicButton,
  CheckUserPermissions,
  ImagePreview,
} from '../../../../../components';
import './styles/styles.css';

interface ICommentCardProp {
  comment: IComment;
  visitor: IUser;
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
  visitor,
  onDeleteClick,
}: ICommentCardProp): JSX.Element => {
  const dateString = new Date(comment.createdAt).toDateString();

  /**
   * Called when the delete button is clicked.
   */
  const handleDeleteOnClick = (): void => onDeleteClick(comment.uuid);

  return (
    <div className='comment-card' key={comment.uuid}>
      <div className='comment-card-top'>
        <div className='comment-card-header'>
          <div className='comment-card-image'>
            <ImagePreview
              className='comment-card-avatar'
              height={50}
              imageUrl={comment.visitor ? comment.visitor.avatarUrl : ''}
              width={50}
            />
          </div>
          <div className='comment-card-info'>
            <div className='comment-card-title'>
              {comment.visitor ? comment.visitor.username : ''}
            </div>
            <div className='comment-card-date'>{dateString}</div>
          </div>
        </div>
        <div className='comment-card-remove'>
          <CheckUserPermissions
            role={visitor && visitor.role}
            action='comments:delete'
            data={{
              commentOwnerId: comment.visitor && comment.visitor.uuid,
              userId: visitor && visitor.uuid,
            }}
            renderComponent={
              <BasicButton
                className='comment-card-remove-button'
                disabled={false}
                label='x'
                onClick={handleDeleteOnClick}
              />
            }
            redirectComponent={<div />}
          />
        </div>
      </div>
      <p className='comment-card-body'>{comment.text}</p>
    </div>
  );
};

export default CommentCard;
