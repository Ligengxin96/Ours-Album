import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core/';
import { useDispatch } from 'react-redux';

import { commentPost } from '../../../actions/posts';
import useStyles from '../styles';

const Comments = ({ post, user }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const commentsRef = useRef();
  
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post?.comments);

  const handleComment = async() => {
    const newComments = await dispatch(commentPost(post._id, `${user?.name}: ${comment}`));
    setComment('');
    setComments(newComments);
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer} >
          <Typography gutterBottom variant="h6">Comments</Typography>
           {
            comments.map((comment, index) => {
              const [name, message] = comment.split(': ');
              return (
                <Typography key={index} gutterBottom variant="subtitle1">
                  <strong title={`${name}: ${message}`}>{name}: </strong>
                  {message}
                </Typography>
              )
            })
          }
          <div ref={commentsRef} />
        </div>
        <div style={{ width: '70%' }}>
          <Typography gutterBottom variant="h6">Leave a comment</Typography>
          <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
          <br />
          <Button style={{ marginTop: '10px' }} fullWidth disabled={comment.length === 0} color="primary" variant="contained" onClick={handleComment}>
            { comment.length === 0 ? 'Input comment' : 'Submit' }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
