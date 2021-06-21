import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';

import { createPost } from '../../actions/posts';

import useStyles from './styles';

const FIELDS_CONFIG = [
  { name: 'creator', label: '创建者' },
  { name: 'title',label: '标题' },
  { name: 'message', label: '描述', multiline: true },
  { name: 'tags', label: '标签(逗号分隔)' }
]

const Form = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [postData , setPostData ] = useState({ creator: '', title: '', message: '', tags: '', selectedFile: '' });

  const onFieldChange = (e, fieldName) => {
    setPostData({ ...postData, [fieldName]: e.target.value });
  }

  const clear = () => {
    setPostData({ creator: '', title: '', message: '', tags: '', selectedFile: '' });
  }

  const uploadFile = (file) => {
    setPostData({ ...postData, selectedFile: file.base64 });
  }

  const onSubmit = async () => {
    dispatch(createPost(postData));
    clear();
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={onSubmit}>
        <Typography variant='h6'>创建我们的回忆</Typography>
        {
          FIELDS_CONFIG.map((field) => {
            const { name, label, multiline = false } = field;
            return <TextField value={postData[name]} onChange={(e) => onFieldChange(e, name)} name={name} label={label} multiline={multiline} key={name} variant='outlined' fullWidth />
          })
        }
        <div className={classes.filedInput} >
          <FileBase type='file' multiple={false} onDone={uploadFile} /> 
        </div>
        <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>创建</Button>
        <Button variant='contained' color='secondary' size='small' fullWidth onClick={clear}>取消</Button>
      </form>
    </Paper>
  )
};

export default Form;
