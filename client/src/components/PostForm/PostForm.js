import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';

import { createPost, updatePost } from '../../actions/posts';

import useStyles from './styles';

const FIELDS_CONFIG = [
  { name: 'title',label: '标题' },
  { name: 'message', label: '描述', multiline: true, rows: 4 },
  { name: 'tags', label: '标签(逗号分隔)' }
]

const Form = ({ id, setEditingPostId }) => {
  const classes = useStyles();
  const formRef = useRef();
  const dispatch = useDispatch();
  const editingPost = useSelector((state) => {
    const { posts } = state.posts;
    return posts.find((post) => {
      return post._id === id;
    });
  });

  const { userInfo } = JSON.parse(localStorage.getItem('userInfo')) || {};
  const [postData , setPostData] = useState({ creator: userInfo?.name, creatorId: userInfo?.id, title: '', message: '', tags: [], selectedFile: '' });

  const onFieldChange = (e, fieldName) => {
    if (fieldName === 'tags') {
      setPostData({ ...postData, [fieldName]: e.target.value.split(',') });
    } else {
      setPostData({ ...postData, [fieldName]: e.target.value });
    }
  }

  const clear = () => {
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
    setEditingPostId(null);
    formRef.current.reset();
  }

  const uploadFile = (file) => {
    setPostData({ ...postData, selectedFile: file.base64 });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if(id) {
      dispatch(updatePost(id, postData));
    } else {
      dispatch(createPost(postData));
    }
    clear();
  }

  useEffect(() => {
    if (editingPost) {
      setPostData(editingPost)
    };
  }, [editingPost]);

  if (!userInfo?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          {`Please login to create your post and like other's post.`}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={onSubmit} ref={formRef}>
        <Typography variant='h6'>{ `${id ? '编辑': '创建'}我们的回忆` }</Typography>
          {
            FIELDS_CONFIG.map((field) => {
              const { name, label, multiline = false, rows } = field;
              return <TextField value={postData[name]} onChange={(e) => onFieldChange(e, name)} name={name} label={label} multiline={multiline} key={name} rows={rows} variant='outlined' fullWidth />
            })
          }
          <div className={classes.filedInput} >
            <FileBase onDone={uploadFile} /> 
          </div>
        <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>提交</Button>
        <Button variant='contained' color='secondary' size='small' fullWidth onClick={clear}>取消</Button>
      </form>
    </Paper>
  )
};

export default Form;
