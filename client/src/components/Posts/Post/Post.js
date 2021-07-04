import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';

import DeleteConfirm  from '../../Common/ConfirmDialog/ConfirmDialog';
import { deletePost, likePost } from '../../../actions/posts'
import compressionStr from '../../../utils/compressionStr';

import nullImage from '../../../images/null.png';
import useStyles from './styles';

const Post = ({ post, setEditingPostId }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const classes = useStyles();
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (confirmed) => {
    if (confirmed === 1) {
      dispatch(deletePost(deleteId));
      setDeleteId(null);
    }
    setOpen(false);
  };

  const editPost = (id) => {
    setEditingPostId(id);
  }

  const deleteThisPost = (id) => {
    setDeleteId(id);
    handleClickOpen();
  }

  const likeThisPost = (id) => {
    dispatch(likePost(id));
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia className={classes.media} title={post.title} image={post.selectedFile || nullImage} />
        <div className={classes.overlayLeft}>
          <Typography variant="h6">{post.creator}</Typography>
          <Typography variant="body2">{moment(post.createdTime).fromNow()}</Typography>
        </div>
        <div className={classes.overlayRight}>
          {(userInfo?.id && post.creatorId === userInfo?.id) && <Button style={{ color: 'white' }} size="small" onClick={() => editPost(post._id)} ><EditIcon fontSize="default" /></Button>}
        </div>
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h5" component="h2" title={post.title}>{compressionStr(post.title, 20)}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" title={post.message}>{compressionStr(post.message, 90)}</Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button size="small" color="primary" disabled={userInfo?.id == null && userInfo?.googleId == null} onClick={() => likeThisPost(post._id)}><ThumbUpAltIcon fontSize="small" /><span className={classes.likes}>{post.likes.length}</span></Button>
          {(userInfo?.id && post.creatorId === userInfo?.id) && <Button size="small" color="secondary" onClick={() => deleteThisPost(post._id)}><DeleteIcon fontSize="small" /></Button>}
        </CardActions>
      </Card>
       <DeleteConfirm isOpen={open} handleClose={handleClose} title='确定要删除吗？' content='删除后内容将永久丢失,无法恢复!' />
    </div>
  )
};

export default Post;