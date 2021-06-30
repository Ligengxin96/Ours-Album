import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Grow, Grid } from '@material-ui/core';

import Posts from '../Posts/Posts';
import Form from '../Form/Form';

import { getPosts } from '../../actions/posts';

const Home = () => {
  const dispatch = useDispatch();
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Grow in>
      <Container>
        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
          <Grid item xs={12} sm={7}>
            <Posts setEditingPostId={setEditingPostId} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form id={editingPostId} setEditingPostId={setEditingPostId} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;