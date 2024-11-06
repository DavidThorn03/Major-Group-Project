class Post {
    constructor(id, title, content, image, comments, likes) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.image = image;
        this.comments = comments;
        this.likes = likes;
    }
    addComment(comment) {
        this.comments.push(comment);
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
    get title() {
        return this.title;
    }
    get content() {
        return this.content;
    }
    get image() {
        return this.image;
    }
    get comments() {
        return this.comments;
    }
    get NumLikes() {
        return this.likes.length;
    }
    isLikedBy(user) {
        return this.likes.includes(user);
    }

}