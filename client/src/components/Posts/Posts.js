import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, CircularProgress } from '@material-ui/core'

import Post from './Post/Post';

import useStyles from './styles';

const Posts = ({ setEditingPostId }) => {
  const posts = useSelector((state) => state.posts);
  console.log('posts component:', posts)
  const classes = useStyles();
  return (
    <div>
      {
        posts.length === 0 ? <CircularProgress /> :
        <Grid className={classes.container} container alignItems="stretch" spacing={3}>
          { 
            posts.map((post, index) => {
              return (
                <Grid key={index} item xs={12} sm={6} md={6}>
                  <Post post={post} setEditingPostId={setEditingPostId} />
                </Grid>
              )
            })
          }
        </Grid>
      }
    </div>
  )
};

export default Posts;
