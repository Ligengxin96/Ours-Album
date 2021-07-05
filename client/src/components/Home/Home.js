import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import { Container, Grow, Grid, AppBar, Paper, TextField, Button } from '@material-ui/core';

import Posts from '../Posts/Posts';
import Form from '../PostForm/PostForm';
import Pagination from '../Common/Pagination/Pagination';

import { getPosts } from '../../actions/posts';

import useStyles from './styles';

const useParamsQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const query = useParamsQuery();

  const [clickSearch, setClickSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(Number(query.get('currentPage')) || 1);

  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);

  const handleTitleChange = e => {
    setTitle(e.target.value);
  }

  const handleAddTag = (tag) => {
    setTags(tags.concat(tag));
  }

  const handleRemoveTag = (removedTag) => {
    setTags(tags.filter(tag => tag !== removedTag));
  }

  const handleSearchClick = (e) => {
    if (e.keyCode === 13) {
      if (title.trim() || tags.length > 0) {
        history.push(`/posts?title=${title}&tags=${tags.join(',')}&currentPage=${1}`);
        setCurrentPage(1);
        setClickSearch(!clickSearch); // trigger fetch post
      } else {
        history.push(`/`);
      }
    }
  };

  useEffect(() => {
    dispatch(getPosts(title, tags, currentPage));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickSearch, currentPage])

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} md={9} sm={6}>
            <Posts setEditingPostId={setEditingPostId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
          <AppBar className={classes.appBarSearch} position="static" color="inherit">
            <TextField onKeyDown={handleSearchClick} value={title} onChange={handleTitleChange} name="search" variant="outlined" label="Title" fullWidth />
              <ChipInput
                className={classes.chipInput}
                value={tags}
                onAdd={(tag) => handleAddTag(tag)}
                onDelete={(tag) => handleRemoveTag(tag)}
                label="Tag"
                variant="outlined"
              />
            <Button className={classes.searchButton} variant="contained" color="primary" onClick={() => handleSearchClick({ keyCode: 13 })}>Search</Button>
          </AppBar>
          <Form id={editingPostId} setEditingPostId={setEditingPostId} />
          <Paper className={classes.pagination} elevation={6}>
            <Pagination title={title} tags={tags} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;