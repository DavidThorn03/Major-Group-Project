const User = require("../Users/User");

class Student extends User {
  constructor(
    id,
    name,
    email,
    course,
    year,
    threads = [],
    posts = [],
    comments = [],
    followThreads = []
  ) {
    super(id, name, email);
    this.course = course;
    this.year = year;
    this.threads = threads;
    this.posts = posts;
    this.comments = comments;
    this.followThreads = followThreads;
  }

  // Additional methods for Student-specific functionality
  addThread(thread) {
    this.threads.push(thread);
  }
  addPost(post) {
    this.posts.push(post);
  }
  addComment(comment) {
    this.comments.push(comment);
  }
  followThread(thread) {
    this.followThreads.push(thread);
  }
  unfollowThread(thread) {
    this.followThreads = this.followThreads.filter((t) => t.id !== thread.id);
  }
}

module.exports = Student;
