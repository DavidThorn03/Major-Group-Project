class Comment {
    constructor(id, content, replies, likes) {
        this.id = id;
        this.content = content;
        this.replies = replies;
        this.likes = likes;
    }
    addReply(reply) {
        this.replies.push(reply);
    }
    addLike(user) {
        this.likes.push(user);
    }
    removeLike(user) {
        this.likes = this.likes.filter(u => u !== user);
    }
    get id() {
        return this.id;
    }
    get content() {
        return this.content;
    }
    get replies() {
        return this.replies;
    }
    get NumLikes() {
        return this.likes.length;
    }
    isLikedBy(user) {
        return this.likes.includes(user);
    }
}