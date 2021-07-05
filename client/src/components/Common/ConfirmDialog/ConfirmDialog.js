import Swal from 'sweetalert2';

import './styles.css';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger',
    cancelButton: 'btn btn-success'
  },
});

export const DeleteConfirmDialog = () => {
  return swalWithBootstrapButtons.fire({
    title: 'Are you sure for delete?',
    text: "You won't be able to revert this, the post will be permanently lost!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'delete',
    cancelButtonText: 'cancel',
    reverseButtons: true
  });;
}