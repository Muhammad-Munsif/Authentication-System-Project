const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    id:        { type: Number, required: true },
    text:      { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    priority:  { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon:        { type: String, default: 'fa-project-diagram' },
    status:      { type: String, enum: ['active', 'pending', 'completed'], default: 'active' },
    progress:    { type: Number, min: 0, max: 100, default: 0 },
    startDate:   { type: Date },
    endDate:     { type: Date },
    team:        [{ type: String, trim: true }],
    tasks:       [taskSchema],
  },
  { timestamps: true }
);

projectSchema.methods.recalculateProgress = function () {
  if (!this.tasks.length) {
    this.progress = 0;
    return;
  }
  const done = this.tasks.filter((t) => t.completed).length;
  this.progress = Math.round((done / this.tasks.length) * 100);
};

module.exports = mongoose.model('Project', projectSchema);