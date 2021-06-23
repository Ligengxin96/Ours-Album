import React from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';

import { deletePost } from '../../../actions/posts'

import nullImage from '../../../images/null.png';
import useStyles from './styles';

const Post = ({ post, setEditingPostId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const editPost = (id) => {
    setEditingPostId(id);
  }

  const deleteThisPost = (id) => {
    dispatch(deletePost(id));
  }

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} title={post.title} image={post.selectedFile || nullImage} />
      <div className={classes.overlayLeft}>
        <Typography variant="h6">{post.creator}</Typography>
        <Typography variant="body2">{moment(post.createdTime).fromNow()}</Typography>
      </div>
      <div className={classes.overlayRight}>
        <Button style={{ color: 'white' }} size="small" onClick={() => editPost(post._id)} ><EditIcon fontSize="default" /></Button>
      </div>
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
      </div>
      <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary"><ThumbUpAltIcon fontSize="small" /><span className={classes.likes}>{post.likes.length}</span></Button>
        <Button size="small" color="primary" onClick={() => deleteThisPost(post._id)}><DeleteIcon fontSize="small" /></Button>
      </CardActions>
    </Card>
  )
};

export default Post;