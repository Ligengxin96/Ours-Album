import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';

import { DeleteConfirmDialog }  from '../../Common/ConfirmDialog/ConfirmDialog';
import { deletePost, likePost } from '../../../actions/posts'
import compressionStr from '../../../utils/compressionStr';

import nullImage from '../../../images/null.png';
import useStyles from './styles';

const Post = ({ post, setEditingPostId }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const editPost = (e, id) => {
    e.stopPropagation();
    setEditingPostId(id);
  }

  const deleteThisPost = async (id) => {
    const result = await DeleteConfirmDialog();
    if (result.isConfirmed) {
      dispatch(deletePost(id));
    }
  }

  const likeThisPost = (id) => {
    dispatch(likePost(id));
  }

  const openPostDetail = () => {
    history.push(`/posts/${post._id}`);
  };


  return (
    <div>
      <Card className={classes.card}>
        <ButtonBase component="span" className={classes.cardAction} onClick={openPostDetail}>
          <CardMedia className={classes.media} title={post.title} image={post.selectedFile || nullImage} />
          <div className={classes.overlayLeft}>
            <Typography variant="h6">{post.creator}</Typography>
            <Typography variant="body2">{moment(post.createdTime).fromNow()}</Typography>
          </div>
          <div className={classes.overlayRight}>
            {(user?.id && post.creatorId === user?.id) && <Button style={{ color: 'white' }} size="small" onClick={(e) => editPost(e, post._id)} ><EditIcon fontSize="default" /></Button>}
          </div>
          <div className={classes.details}>
            <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          </div>
          <Typography className={classes.title} gutterBottom variant="h5" component="h2" title={post.title}>{compressionStr(post.title, 20)}</Typography>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p" title={post.message}>{compressionStr(post.message, 90)}</Typography>
          </CardContent>
        </ButtonBase>
          <CardActions className={classes.cardActions}>
            <Button size="small" color="primary" disabled={user?.name == null} onClick={() => likeThisPost(post._id)}><ThumbUpAltIcon fontSize="small" /><span className={classes.likes}>{post.likes.length}</span></Button>
            {(user?.id && post.creatorId === user?.id) && <Button size="small" color="secondary" onClick={() => deleteThisPost(post._id)}><DeleteIcon fontSize="small" /></Button>}
        </CardActions>
      </Card>
    </div>
  )
};

export default Post;