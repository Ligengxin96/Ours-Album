import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';

import { LOGOUT } from '../../constants/constantsType';
import usImgPath from '../../images/us.png';
import useStyles from './styles';


const Navbar = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const initUserState = JSON.parse(localStorage.getItem('userInfo'));
  const [user, setUser] = useState(initUserState);

  const logout = () => {
    dispatch({ type: LOGOUT, payload: null });
    history.push('/login');
    setUser(null);
  }

  useEffect(() => {
    const token = user?.token;
    
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()){
        logout();
      };
    }
    setUser(initUserState);
  }, [location.pathname]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography className={classes.heading} variant="h2" align="center">Ours Album</Typography>
        <img className={classes.image} src={usImgPath} alt="icon" height="60" />
      </div>
      <Toolbar className={classes.toolbar}>
        {
          user ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user.userInfo.name} src={user.userInfo.imageUrl}>{user.userInfo.name.toUpperCase().charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{user.userInfo.name}</Typography>
            <Button onClick={logout} variant="contained" className={classes.logout} color="secondary">注销</Button>
          </div>
          ) : (
            <Button component={Link} to="/login" variant="contained" color="primary">登录</Button>
          )
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;