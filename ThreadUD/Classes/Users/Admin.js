const User = require("../Users/User");

class Admin extends User {
  constructor(
    id,
    name,
    email,
    permissions = ["delete", "flag", "terminate"],
    actionsLog = []
  ) {
    super(id, name, email);
    this.permissions = permissions; // Permissions for admin actions
    this.actionsLog = actionsLog; // Log of admin actions
  }

  // Log an action in the admin's activity log
  logAction(action, targetId) {
    const timestamp = new Date().toISOString();
    this.actionsLog.push({ action, targetId, timestamp });
  }

  // Placeholder for deleting content (to be handled by backend)
  deleteContent(content) {
    console.log(`Request to delete content with ID: ${content.id}`);
    this.logAction("delete", content.id);
    // Real logic would involve calling a backend service/API
  }

  // Placeholder for flagging inappropriate content
  flagContent(content) {
    console.log(`Request to flag content with ID: ${content.id}`);
    this.logAction("flag", content.id);
    // Real logic would involve calling a backend service/API
  }

  // Placeholder for terminating a user account
  terminateAccount(user) {
    console.log(`Request to terminate account with ID: ${user.id}`);
    this.logAction("terminate", user.id);
    // Real logic would involve calling a backend service/API
  }

  // Retrieve the admin's actions log
  getActionsLog() {
    return this.actionsLog;
  }
}

module.exports = Admin;
