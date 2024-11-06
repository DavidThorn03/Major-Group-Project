class User {
    constructor(id, name, email, threads, posts, comments, followThreads) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.threads = threads;
        this.posts = posts;
        this.comments = comments;
        this.followThreads = followThreads;
    }
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
        this.followThreads = this.followThreads.filter(t => t.id !== thread.id);
    }
    getThreads() {
        return this.threads;
    }
    getPosts() {
        return this.posts;
    }
    getComments() {
        return this.comments;
    }
    getFollowThreads() {
        return this.followThreads;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
}