import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle , DialogContent, DialogContentText, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import useStyles from './styles';

const ConfirmDialog = ({ isOpen = false, handleClose, title, content }) => {
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
          {title}
          {
            handleClose ? (
              <IconButton aria-label="close" onClick={() => handleClose(0)}>
                <CloseIcon className={classes.iconButton}/>
              </IconButton>
            ) : null
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(0)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose(1)} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;