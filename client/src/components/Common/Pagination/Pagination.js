import React from 'react';
import { useSelector } from 'react-redux';
import { Pagination , PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';

import useStyles from './styles';

const MyPagination = ({ title, tags, currentPage, setCurrentPage }) => {
  const classes = useStyles();
  const { pagination } = useSelector((state) => state.posts);

  const changePage = (_, page) => {
    setCurrentPage(page);
  }

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={pagination.maxPage}
      page={currentPage}
      variant="outlined"
      color="primary"
      onChange={changePage}
      renderItem={(item) => <PaginationItem {...item} component={Link} to={`/posts?title=${title}&tags=${tags.join(',')}&currentPage=${item.page}`} />}
    />
  );
};

export default MyPagination;
