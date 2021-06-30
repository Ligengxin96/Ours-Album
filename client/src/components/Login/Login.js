
import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { GoogleLogin } from 'react-google-login';

import Input from './Input/Input';
import GoogleIcon from './GoogleIcon/GoogleIcon';

import useStyles from './styles';

const initialFormValues = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Login = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const switchMode = () => {
    setShowPassword(false);
    setFormValues(initialFormValues);
    setIsRegister((prevIsRegister) => !prevIsRegister);
  }

  const googleSuccess = async (res) => {
    console.log('Goolge acount login successful,', res);
  };

  const googleError = (error) => {
    console.log(`Google acount login failed with error: ${JSON.stringify(error)}`);
    setOpen(true);
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3} >
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>{ isRegister ? '注册' : '登录' }</Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            { 
              isRegister && (
                <>
                  <Input handleChange={handleInputChange} name='firstName' label='姓氏' autoFocus half />
                  <Input handleChange={handleInputChange} name='lastName' label='名字' half />
                </> 
              )
            }
            <Input handleChange={handleInputChange} name='email' label='邮箱' type='email' />
            <Input handleChange={handleInputChange} handleShowPassword={handleShowPassword} name='password' label='密码' type={showPassword ? 'text' : 'password'} />
            { isRegister && <Input handleChange={handleInputChange} name='confirmPassword' label='确认密码' type='password' /> }
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            { isRegister ? '注册' : '登录' }
          </Button>
          <GoogleLogin
            clientId='586474444278-kujak2tsqj0osdjh5tl4c26l2dm7nnb8.apps.googleusercontent.com'
            render={(renderProps) => (
              <Button onClick={renderProps.onClick} disabled={renderProps.disabled} className={classes.googleButton} fullWidth color='primary' startIcon={<GoogleIcon />} variant='contained'>
                Google账号登录
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy='single_host_origin'
          />
          <Grid container justify='flex-end'>
            <Grid item>
              <Button onClick={switchMode}>
                { isRegister ? '已经有账号了?去登录' : '还没有账号?去注册' }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical:'top', horizontal: 'center' }}>
        <Alert elevation={6} variant="filled" onClose={handleClose} severity="error" >Google 账户登录失败,请稍后再试</Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
