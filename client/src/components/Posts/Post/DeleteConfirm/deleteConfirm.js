import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle , DialogContent, DialogContentText, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import useStyles from './styles';

const DeleteConfirm = ({ isOpen = false, handleClose }) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.title}>
          确定要删除吗？
          {
            handleClose ? (
              <IconButton aria-label="close" onClick={() => handleClose(0)}>
                <CloseIcon className={classes.iconButton}/>
              </IconButton>
            ) : null
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">删除后内容将永久丢失,无法恢复!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(0)} color="primary">
            取消
          </Button>
          <Button onClick={() => handleClose(1)} color="secondary" autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteConfirm;