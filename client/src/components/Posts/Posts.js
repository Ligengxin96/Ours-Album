import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, CircularProgress } from '@material-ui/core'

import Post from './Post/Post';

import useStyles from './styles';

const Posts = ({ setEditingPostId, currentPage }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const classes = useStyles();

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7rem" />
      </Paper>
    );
  }

  if (posts.length === 0) {
    return (
      <Paper elevation={6} className={classes.emptyPaper}>
        <h1>No posts found</h1>
      </Paper>
    );
  }

  return (
    <div>
      {
        <Grid className={classes.container} container alignItems="stretch" spacing={3}>
          { 
            posts.map((post, index) => {
              return (
                <Grid key={index} item xs={12} sm={12} md={6} lg={3}>
                  <Post post={post} setEditingPostId={setEditingPostId} currentPage={currentPage} />
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
