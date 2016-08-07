const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user) done(null, false);

        // compare passwords - is password to equal to user.pasword?
        user.comparePassword(password, (error, isMatch) => {
            if (error) return done(error);
            if (!isMatch) return done(null, false);
            return done(null, user);
        });
    });
});

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret,
};

// Create  JWT Strategy
const JwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (err, user) => {
        if (err) return done(err, false);
        if (user) done(null, user);
        else done(null, false);
    });
});

// Tell passport to use this Strategy
passport.use(JwtLogin);
passport.use(localLogin);
