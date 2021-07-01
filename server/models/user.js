import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    id: String,
    firstName: {
      type: String,
      require: true
    },
    lastName: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    createdTime: {
      type: Date,
      default: new Date(),
    },
    lastestUpdateTime: {
      type: Date,
      default: new Date(),
    }
});

const UserModal = mongoose.model('User', userSchema);

export default UserModal;