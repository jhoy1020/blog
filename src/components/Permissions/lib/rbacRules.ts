const rules = {
  admin: {
    static: [
      'comments:create',
      'comments:delete',
      'dashboard-page:visit',
      'home-page:visit',
      'posts:create',
      'posts:delete',
      'posts:edit',
      'posts:list',
      'posts:view'
    ]
  },
  visitor: {
    dynamic: {
      'comments:create': ({ isAuthenticated }) => {
        return isAuthenticated;
      },
      'comments:delete': ({ userId, commentOwnerId }) => {
        if (!userId || !commentOwnerId) {
          return false;
        }
        return userId === commentOwnerId;
      }
    },
    static: ['home-page:visit', 'posts:list', 'posts:view']
  }
};

export default rules;
