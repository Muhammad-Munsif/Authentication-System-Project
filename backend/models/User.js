const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, 'First name required'], trim: true, minlength: 2 },
    lastName:  { type: String, required: [true, 'Last name required'],  trim: true, minlength: 2 },
    email:     { type: String, required: [true, 'Email required'], unique: true, lowercase: true, trim: true },
    phone:     { type: String, trim: true, default: '' },
    dob:       { type: Date },
    password:  { type: String, required: [true, 'Password required'], minlength: 8, select: false },
    role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);