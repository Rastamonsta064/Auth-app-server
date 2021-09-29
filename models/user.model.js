import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first: {type: String, required: true},
    last: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    phone: {type: String, required: true},
    secret: {type: String, unique: true, required: true},

}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;