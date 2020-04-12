import React from 'react';
import { Route } from 'react-router-dom';
import { PostProvider } from '../../state/posts/postProvider';
import { PostReducer } from '../../state/posts/reducers';
import { Footer, Header, Navigation } from './components';
import AboutPage from './scenes/About';
import ContactPage from './scenes/Contact';
import ConnectedHomePage from './scenes/Home';
import ConnectedPostDisplayPage from './scenes/Post';
import PrivacyPolicy from './scenes/Privacy';

const initialPostState: IPostState = {
  nextOffset: 0,
  posts: [],
};

const BlogRoutes = (): JSX.Element => {
  return (
    <div>
      <Navigation />
      <main>
        <Header />
        <PostProvider initialState={initialPostState} reducers={PostReducer}>
          <Route exact={true} path='/' component={ConnectedHomePage} />
          <Route path='/posts/:uuid' component={ConnectedPostDisplayPage} />
        </PostProvider>
        <Route path='/about' component={AboutPage} />
        <Route path='/contact' component={ContactPage} />
        <Route path='/privacy' component={PrivacyPolicy} />
      </main>
      <Footer />
    </div>
  );
};

export default BlogRoutes;
