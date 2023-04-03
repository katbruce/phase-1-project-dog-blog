const allPosts = document.querySelector("#blog-posts");
let latestImgId = '';
const newPostForm = document.querySelector("#new-post-form")
document.addEventListener('DOMContentLoaded', init())

function init () {
    fetchData();
    imageButton();
    createNewPost();
}

function imageButton () {
    document.querySelector('#new-image-button').addEventListener('click', generateRandom)
}

function generateRandom() {
    fetch ('https://dog.ceo/api/breeds/image/random')
        .then (res => res.json())
        .then (data => randomImg(data.message))
}

function randomImg(image) {
    newDogImg = document.querySelector('#new-image-container')
    newDogImg.src = image
}

function fetchData(){
    fetch('http://localhost:3000/posts')
    .then((res)=> res.json())
    .then((data) => {
        data.forEach((post) => {
            renderPost(post)
            renderLikes(post)
            renderCommentForm(post)
        })
        fetchComments()
    })
}

//render each post
function renderPost(post){
    let newPost = document.createElement('div')
    let newContent = document.createElement('p');
    let newImg = document.createElement('img');
    let newName = document.createElement('h3');
    let postLikes = document.createElement('div');
    let postComments = document.createElement('div')
    
    latestImgId = post.id;

    newPost.id = `post-${post.id}`
    newContent.textContent = post.content;
    newImg.src = post.image;
    newImg.alt = "Image of a cute dog.";
    newName = post.name;
    postLikes.id = `post-${post.id}-likes`
    postComments.id = `post-${post.id}-comments`
    
    newPost.append(newName, newImg, newContent, postLikes, postComments);
    allPosts.append(newPost);
}

function renderLikes (postObj) {
    let likesBlock = document.querySelector(`#post-${postObj.id}-likes`);
    let numLikes =  document.createElement('span');
    let likeBtn = document.createElement('button');
    let nLikes = parseInt(postObj.likes);
    numLikes.className = 'like-count'
    numLikes.textContent = nLikes;
    likeBtn.textContent = ("♡");//♥
    likeBtn.addEventListener("click", upvote);

    likesBlock.append(numLikes, likeBtn)
}

function fetchComments () {
    fetch('http://localhost:3000/comments')
    .then((res)=> res.json())
    .then((data) => {
        data.forEach((comment) => {
            renderComments(comment)
        })
    })
    //add event listener comment form

}

function renderComments(commentObj){
    let commentBlock = document.getElementById(`post-${commentObj.imageId}-comments`)
    let newComment = document.createElement('span')
    let space = document.createElement('br')
    newComment.textContent = commentObj.content
    commentBlock.append(newComment, space)
}

function renderCommentForm(postObj){
    let currentPost = document.querySelector(`#post-${postObj.id}`)
    let commentForm = document.createElement('form')
    commentForm.className = 'new-comment-form'
    commentForm.innerHTML = `
        <input type="text" value="Add comment...">
        <input type="submit" id="submit">
    `
    commentForm.addEventListener('submit', addComment)
    currentPost.append(commentForm)
}

//updating number of likes
function upvote(e){
    let postId = parseInt(e.target.parentNode.id.split('-')[1]);
    let numLikes = parseInt(e.target.previousElementSibling.textContent);
    numLikes++
    let blogObj = {
        id: postId,
        likes: numLikes
    };
    fetch (`http://localhost:3000/posts/${postId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(blogObj)
    })
        .then(res => res.json())
        .then(data => e.target.previousElementSibling.textContent = data.likes)
}

function addComment(e){
    e.preventDefault()
    let postId = parseInt(e.target.parentNode.id.split('-')[1]);
    let newComment = document.createElement('span')
    newComment.textContent = e.target[0].value
    let newCommentObj = {
        imageId: postId,
        content: newComment.textContent
    }

    fetch (`http://localhost:3000/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newCommentObj)
    })
    .then((res)=> res.json())
    .then(data => renderComments(data))

    e.target.reset()
}

function createNewPost(){
    newPostForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let newName = document.querySelector("#new-dog-name").value;
        let newPostImg = document.querySelector("#new-image-container").src;
        let newPostContent = document.querySelector("#new-content").value;
        const newPostObj = {id: ++latestImgId, name: newName, image: newPostImg, content: newPostContent, likes: 0, comments: []}
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newPostObj)
        })
        .then(renderPost(newPostObj));
        newDogImg.src = "https://images.dog.ceo/breeds/beagle/n02088364_12920.jpg";
        newPostForm.reset();    
    }
    )}
