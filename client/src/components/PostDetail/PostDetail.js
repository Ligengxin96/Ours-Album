import React, { useEffect } from 'react';
import moment from 'moment';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import Comments from './Comments/Comments';
import shuffle from '../../utils/shuffle';
import compressionStr from '../../utils/compressionStr';
import { getPosts, getPostById } from '../../actions/posts';
import nullImage from '../../images/null.png';
import useStyles from './styles';

const PostDetail = () => {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('userInfo'));

  const { post, posts, isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post) {
      dispatch(getPosts('', '', post.tags, 1));
    }
  }, [dispatch, post]);

  if (!post){
    return null;
  }

  const openPostDetail = (_id) => history.push(`/posts/${_id}`);

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7rem" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <Paper className={classes.paper} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag}`)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.creator}</Typography>
          <Typography variant="body1">{moment(post.createdTime).fromNow()}</Typography>
          { 
            user &&
            <>
              <Divider className={classes.divider} />
              <Comments user={user} post={post} /> 
              <Divider className={classes.divider} /> 
            </>
          }
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || nullImage} alt={post.title} />
        </div>
      </div>
      { 
        recommendedPosts.length > 0 && (
          <div className={classes.section}>
            <Typography gutterBottom variant="h5">You might also like:</Typography>
            <Divider />
            <div className={classes.recommendedPosts}>
              {
                shuffle(recommendedPosts).slice(0, 4).map(({ _id, title, name, message, likes, selectedFile }) => (
                  selectedFile && (
                    <div key={_id} className={classes.recommendedPost} onClick={() => openPostDetail(_id)} >
                      <Typography gutterBottom variant="h6" title={title}>{compressionStr(title, 40)}</Typography>
                      <Typography gutterBottom variant="subtitle2" title={name}>{name}</Typography>
                      <Typography gutterBottom variant="subtitle2" title={message}>{compressionStr(message, 60)}</Typography>
                      <Typography gutterBottom variant="subtitle1">{likes.length} people likes this post</Typography>
                      <img className={classes.img} src={selectedFile} />
                    </div>
                  )
                ))
              }
            </div>
          </div>
        )
      }
    </Paper>
  );
};

export default PostDetail;
