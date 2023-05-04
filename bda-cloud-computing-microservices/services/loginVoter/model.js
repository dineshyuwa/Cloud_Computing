const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);

const Voter = mongoose.model('Voter', { 
  name: String,
  password: String,
  nic: String,
  phoneNumber: String,
  status: String
 });



module.exports = { Voter }