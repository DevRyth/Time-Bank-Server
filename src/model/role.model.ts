const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

autoIncrement.initialize(mongoose.connection);
RoleSchema.plugin(autoIncrement.plugin, {
  model: 'Role',
  field: 'role_id',
  startAt: 1,
  incrementBy: 1
});

export { }

module.exports = mongoose.model('Role', RoleSchema);

