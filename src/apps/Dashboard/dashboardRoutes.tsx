import React from 'react';
import { Route } from 'react-router-dom';
import { PostProvider } from '../../state/posts/postProvider';
import { PostReducer } from '../../state/posts/reducers';
import { DashboardHeader } from './components';
import AuthDashboardPage from './scenes/Home';
import AuthCreatePostPage from './scenes/Posts/CreatePost';
import AuthEditPostPage from './scenes/Posts/EditPost';
import './styles/styles.css';

const initialPostState: IPostState = {
  nextOffset: 0,
  posts: []
};

/**
 * The dashboard page.
 */
const DashboardRoutes = (): JSX.Element => {
  return (
    <main className='dashboard-container'>
      <DashboardHeader />
      <PostProvider initialState={initialPostState} reducers={PostReducer}>
        <Route exact={true} path='/dashboard' component={AuthDashboardPage} />
        <Route
          exact={true}
          path='/dashboard/posts'
          component={AuthCreatePostPage}
        />
        <Route
          exact={true}
          path='/dashboard/posts/:uuid'
          component={AuthEditPostPage}
        />
      </PostProvider>
    </main>
  );
};

export default DashboardRoutes;
