const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema({
    email: {
        type: String,
        uniq: true,
        lowercase: true,
    },
    password: String,
});

// On save Hook, ecrypt password
// Before save model, run this function
userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) next(err);
            user.password = hash;
            next();
        });
    });
});

// Create new model class
const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
