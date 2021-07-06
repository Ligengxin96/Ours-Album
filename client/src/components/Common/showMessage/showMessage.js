import Swal from 'sweetalert2';
import errorMap from '../../../config/errorMap';


const errorMessage = Swal.mixin({
  icon: 'error',
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: '500',
});

const successMessage = Swal.mixin({
  icon: 'success',
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: '500'
});


export const showError = (text) => {
  const message = errorMap[text] || text;
  errorMessage.fire(message);
}

export const showSuccess = (text) => {
  successMessage.fire(text);
}
