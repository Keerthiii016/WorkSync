const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }]
}, {
  timestamps: true
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'on-hold'],
    default: 'not-started'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  comments: [commentSchema],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  checklist: [{
    item: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  timeLogs: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    description: String
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ title: 'text', description: 'text' });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Virtual for completion percentage based on checklist
taskSchema.virtual('completionPercentage').get(function() {
  if (!this.checklist || this.checklist.length === 0) {
    return this.status === 'completed' ? 100 : 0;
  }
  
  const completedItems = this.checklist.filter(item => item.completed).length;
  return Math.round((completedItems / this.checklist.length) * 100);
});

// Ensure virtuals are serialized
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update completedAt
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('status') && this.status !== 'completed') {
    this.completedAt = undefined;
  }
  next();
});

// Method to add comment
taskSchema.methods.addComment = function(userId, content, attachments = []) {
  this.comments.push({
    user: userId,
    content,
    attachments
  });
  return this.save();
};

// Method to add checklist item
taskSchema.methods.addChecklistItem = function(item) {
  this.checklist.push({ item });
  return this.save();
};

// Method to toggle checklist item
taskSchema.methods.toggleChecklistItem = function(itemIndex) {
  if (itemIndex >= 0 && itemIndex < this.checklist.length) {
    this.checklist[itemIndex].completed = !this.checklist[itemIndex].completed;
    this.checklist[itemIndex].completedAt = this.checklist[itemIndex].completed ? new Date() : undefined;
  }
  return this.save();
};

// Method to start time tracking
taskSchema.methods.startTimeTracking = function(userId, description = '') {
  this.timeLogs.push({
    user: userId,
    startTime: new Date(),
    description
  });
  return this.save();
};

// Method to stop time tracking
taskSchema.methods.stopTimeTracking = function(userId) {
  const activeLog = this.timeLogs.find(log => 
    log.user.toString() === userId.toString() && !log.endTime
  );
  
  if (activeLog) {
    activeLog.endTime = new Date();
  }
  
  return this.save();
};

// Method to get total time spent
taskSchema.methods.getTotalTimeSpent = function() {
  return this.timeLogs.reduce((total, log) => {
    if (log.endTime) {
      return total + (log.endTime - log.startTime);
    }
    return total;
  }, 0);
};

// Static method to find overdue tasks
taskSchema.statics.findOverdueTasks = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' }
  }).populate('project', 'name').populate('assignedTo', 'name email');
};

// Static method to find tasks due soon
taskSchema.statics.findTasksDueSoon = function(days = 3) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    dueDate: { 
      $gte: new Date(), 
      $lte: futureDate 
    },
    status: { $ne: 'completed' }
  }).populate('project', 'name').populate('assignedTo', 'name email');
};

module.exports = mongoose.model('Task', taskSchema); 