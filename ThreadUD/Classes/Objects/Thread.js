class Thread{
    constructor(id, name, posts){
        this.id = id;
        this.name = name;
        this.posts = posts;
    }
    addPost(post){
        this.posts.push(post);
    }
    get id(){
        return this.id;
    }
    get name(){
        return this.name;
    }
}