import React from 'react';
import './styles/styles.css';

interface IPostDetailsProps {
  post?: IPost;
}

/**
 * Displays the post details.
 * @param post The post to display.
 */
const PostDetails = ({ post }: IPostDetailsProps): JSX.Element => {
  const dateString = post ? new Date(post.createdAt).toDateString() : '';
  return (
    <div className='blog-post-container'>
      <img
        alt='post'
        className='post-details-image'
        height='auto'
        src={post && post.imageUrl}
        width={250}
      />
      <h2>{post ? post.title : ''}</h2>
      <p>{dateString}</p>
      <div dangerouslySetInnerHTML={{ __html: post ? post.text : '' }} />
    </div>
  );
};

export default PostDetails;
