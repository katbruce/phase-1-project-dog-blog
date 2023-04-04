const allPosts = document.querySelector("#blog-posts"); //can maybe declare in the function
let latestImgId;

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
    let newDogImg = document.querySelector('#new-image')
    let postSubmit = document.querySelector('#submit-post')
    let imgOverlay = document.querySelector('#new-image-container')
    newDogImg.style.display = 'inherit'
    newDogImg.src = image
    postSubmit.style.display = 'inherit'
    imgOverlay.addEventListener('mouseenter', displayBreed)
    imgOverlay.addEventListener('mouseleave', displayBreedOff)
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
    latestImgId = post.id;
    let newPost = document.createElement('div')
    let newContent = document.createElement('p');
    let newImg = document.createElement('div');
    let newName = document.createElement('h3');
    let postLikes = document.createElement('div');
    let postComments = document.createElement('div')

    newPost.id = `post-${post.id}`
    newImg.innerHTML = `
        <div class="img-overlay"></div>
        <img src="${post.image}" alt="Image of a cute dog." class="blog-image">
    `
    newImg.className = 'image-container'
    newContent.textContent = post.content;
    newName = post.name;
    postLikes.id = `post-${post.id}-likes`
    postComments.id = `post-${post.id}-comments`
    
    newImg.addEventListener('mouseenter', displayBreed)
    newImg.addEventListener('mouseleave', displayBreedOff)
    newPost.append(newName, newImg, newContent, postLikes, postComments);
    allPosts.prepend(newPost);
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
        <input type="submit" id="submit-comment">
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
    const newPostForm = document.querySelector("#new-post-form")
    newPostForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let newName = document.querySelector("#new-dog-name").value;
        let newImgSrc = document.querySelector("#new-image").src;
        let newPostContent = document.querySelector("#new-content").value;
        let newImg = document.querySelector('#new-image')
        let postSubmit = document.querySelector('#submit-post')

        const newPostObj = {id: ++latestImgId, name: newName, image: newImgSrc, content: newPostContent, likes: 0}
        //check to see that form is filled out
        newPostObj.name.length == 0 ? alert('Please fill out all form fields.') : renderNewPost(newPostObj)
        newPostForm.reset(); 

        newImg.style.display = 'none'
        postSubmit.style.display = 'none'
    })
}

function renderNewPost(newPost) {
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newPost)
    })
    .then((res)=> res.json())
    .then((data) => {
        renderPost(data)
        renderLikes(data)
        renderCommentForm(data)
    })
}

function displayBreed(e) {
    let overlay = e.target.querySelector('.img-overlay')
    overlay.style.display = 'inherit'
    overlay.textContent = getBreed(e)
}

function displayBreedOff(e) {
    e.target.querySelector('.img-overlay').style.display = 'none'
}

function getBreed(event) {
    breedName = event.target.querySelector('.blog-image').src.split('/')[4]
    let breedArr = breedName.split('-')
    breedArr.length !== 1 ? breedArr.reverse() : breedArr
    return breedArr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}