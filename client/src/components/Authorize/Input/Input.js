import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const Input = ({ name, value, handleChange, label, half, autoFocus, type, handleShowPassword, errorText }) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      value={value}
      name={name}
      onChange={handleChange}
      variant='outlined'
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      error={errorText}
      helperText={errorText}
      InputProps={name === 'password' ? {
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton onClick={handleShowPassword}>
              {type === 'password' ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      } : null}
    />
  </Grid>
);

export default Input;
