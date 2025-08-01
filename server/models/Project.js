const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold', 'cancelled'],
    default: 'active'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'viewer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowFileUploads: {
      type: Boolean,
      default: true
    },
    autoAssignTasks: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'team.user': 1 });
projectSchema.index({ name: 'text', description: 'text' });

// Virtual for task count
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Virtual for completed task count
projectSchema.virtual('completedTaskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true,
  match: { status: 'completed' }
});

// Ensure virtuals are serialized
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

// Method to check if user has access to project
projectSchema.methods.hasAccess = function(userId, requiredRole = 'viewer') {
  const roles = ['viewer', 'editor', 'admin'];
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  // Owner has all access
  if (this.owner.toString() === userId.toString()) {
    return true;
  }
  
  // Check team member access
  const teamMember = this.team.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!teamMember) return false;
  
  const memberRoleIndex = roles.indexOf(teamMember.role);
  return memberRoleIndex >= requiredRoleIndex;
};

// Method to add team member
projectSchema.methods.addTeamMember = function(userId, role = 'viewer') {
  const existingMember = this.team.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    existingMember.role = role;
  } else {
    this.team.push({ user: userId, role });
  }
  
  return this.save();
};

// Method to remove team member
projectSchema.methods.removeTeamMember = function(userId) {
  this.team = this.team.filter(member => 
    member.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Method to update progress based on tasks
projectSchema.methods.updateProgress = async function() {
  const Task = mongoose.model('Task');
  const totalTasks = await Task.countDocuments({ project: this._id });
  const completedTasks = await Task.countDocuments({ 
    project: this._id, 
    status: 'completed' 
  });
  
  this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema); 