const mongoose = require('mongoose');

module.exports = function() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};
