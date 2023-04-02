const allPosts = document.querySelector("#blog-posts");

document.addEventListener('DOMContentLoaded', init())

function init () {
    fetchData();
    imageButton()
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
        })
    })
}

//render each post
function renderPost(post){
    let newPost = document.createElement('div')
    let newContent = document.createElement('p');
    let newImg = document.createElement('img');
    let likeBtn = document.createElement('button');
    let newName = document.createElement('h3');
    let numLikes = document.createElement('p');
    let postComments = document.createElement('div')
    
    newPost.id = `post-${post.id}`
    newContent.textContent = post.content;
    newImg.src = post.image;
    newImg.alt = "Image of a cute dog.";
    newName = post.name;
    postComments.id = `post-${post.id}-comments`

    //could potentially separate this out
    let nLikes = parseInt(post.likes);
    numLikes.className = 'like-count'
    numLikes.textContent = nLikes;
    likeBtn.textContent = ("♡");//♥
    likeBtn.addEventListener("click", upvote);
    
    newPost.append(newName, newImg, newContent, likeBtn, numLikes, postComments);
    allPosts.append(newPost);

    //write function to populate comments
    renderComments(post)

    //write function to render comment form
    renderCommentForm(post)
}

function renderComments(postData){
    let commentBlock = document.querySelector(`#post-${postData.id}-comments`)

    postData.comments.forEach(comment => {
        let newComment = document.createElement('span')
        let space = document.createElement('br')
        newComment.textContent = comment.content
        commentBlock.append(newComment, space)
    })
}

function renderCommentForm(postData){
    let currentPost = document.querySelector(`#post-${postData.id}`)
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
    let numLikes = parseInt(e.target.nextElementSibling.textContent);
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
        .then(data => e.target.nextElementSibling.textContent = data.likes)
}

function addComment(e){
    e.preventDefault()
    let postId = parseInt(e.target.parentNode.id.split('-')[1]);
    let newComment = document.createElement('span')
    newComment.textContent = e.target[0].value
    let newCommentObj = {
        id: postId,
        content: newComment.textContent
    }

    //not sure what url to post to
    // fetch (`http://localhost:3000/posts/${postId}`, {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(blogObj)
    // })
}