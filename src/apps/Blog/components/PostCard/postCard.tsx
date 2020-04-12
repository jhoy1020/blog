import React from 'react';
import { Link } from 'react-router-dom';
// import { ImagePreview } from '../../../../components/SharedComponents';
import './styles/styles.css';

/**
 * Displays a details of the post.
 * @param createdAt The date when the post was created.
 * @param imageUrl The url to the post's image.
 * @param text The post's content.
 * @param title The title of the post.
 * @param uuid The uuid of the post.
 */
const PostCard = ({
  createdAt,
  text,
  title,
  uuid,
  imageUrl,
}: IPost): JSX.Element => {
  const dateString: string = new Date(createdAt).toDateString();
  return (
    <Link
      to={`/posts/${uuid}`}
      style={{ textDecoration: 'none', color: 'black' }}
    >
      <div className='post-card'>
        <h2 className='post-card-header'>{title}</h2>
        <h4 className='post-card-date'>{dateString}</h4>
        <div
          className='post-card-details'
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      </div>
    </Link>
  );
};

export default PostCard;
