import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
   name: { type: String, required: true, trim: true, },
   email: { type: String, required: true, unique: true, trim: true, },
   password: { type: String, required: true, minlength: 6, },
   isVerified: { type: Boolean, default: false, },
   role: { type: String, default: 'user', },
   createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

const User = mongoose.model('User', userSchema);
export default User;
