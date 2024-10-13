const addChangeHistory = function(schema) {
  // Add the history field to the schema
  schema.add({
    history: [{ type: String }]
  });

  // Add the pre-save middleware to track changes
  schema.pre('save', function(next) {
    if (!this.isNew) {
      const changedFields = this.modifiedPaths();
      if (changedFields.length > 0) {
        const changes = changedFields.map(field => {
          return `${field}: ${this.getOldValue(field)} -> ${this[field]}`;
        });
        
        const now = new Date();
        const changeLog = `${changes.join(', ')} by ${this.changedBy} on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
        this.history.push(changeLog);
      }
    }
    
    this.updatedAt = Date.now();
    next();
  });
};

module.exports = { addChangeHistory };

