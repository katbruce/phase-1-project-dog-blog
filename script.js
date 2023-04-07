const allPosts = document.querySelector("#blog-posts");
let latestImgId;

document.addEventListener('DOMContentLoaded', init())

function init () {
    fetchData();
    imageButton();
    createNewPost();
    darkMode();
    eventListeners();
}

function eventListeners() {
    //bypass login with continue as guest
    document.querySelector('#guest-sign-in-btn').addEventListener("click", showForm);
    //sort dropdown selector
    document.querySelector('#sort-dropdown').addEventListener('change', sortPreference)
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
    newDogImg.style.display = 'flex'
    newDogImg.src = image
    postSubmit.style.display = 'flex'
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
function renderPost(post, b = 1){
    latestImgId = post.id;
    let newPost = document.createElement('div');
    let newContent = document.createElement('p');
    let newImg = document.createElement('div');
    let newName = document.createElement('h3');
    let postComments = document.createElement('div')

    newPost.id = `post-${post.id}`
    newImg.innerHTML = `
        <div class="img-overlay"></div>
        <img src="${post.image}" alt="Image of a cute dog." class="blog-image">
        <div class="likes-container" id="post-${post.id}-likes"></div>
    `
    newImg.className = 'image-container'
    newContent.textContent = post.content;
    newContent.className = 'blog-content'
    newContent.style.fontStyle = 'italic'
    newContent.style.fontWeight = 'bold'
    newName.textContent = post.name;
    newName.className = 'blog-title'
    postComments.id = `post-${post.id}-comments`
    postComments.className = 'blog-comments'
    
    newImg.addEventListener('mouseenter', displayBreed)
    newImg.addEventListener('mouseleave', displayBreedOff)
    newPost.append(newName, newImg, newContent, postComments);

    //check to see which sort order to render in
    b == 1 ? allPosts.prepend(newPost) : allPosts.append(newPost)
}

function renderLikes (postObj) {
    let likesBlock = document.querySelector(`#post-${postObj.id}-likes`);
    let nLikes = parseInt(postObj.likes);
    likesBlock.innerHTML = `
        <div class="triangle-up">△</div><br>
        <span class="like-count">${nLikes}</span><br>
        <div class="triangle-down">▽</div>
    `
    document.querySelector('.triangle-up').addEventListener("click", upVote);
    document.querySelector('.triangle-down').addEventListener("click", downVote);
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
    //the setHTML method is experimental and doesn't work with all browsers
    //it works just like innerHTML but sanitizes the input
    commentForm.setHTML(`
        <input type="text" class="add-comment" value="Add comment...">
        <input type="submit" class="submit-comment"><br><br><hr>
    `)
    commentForm.addEventListener('submit', addComment)
    currentPost.append(commentForm)
}

//updating number of likes
function upVote(e){
    let postId = parseInt(e.target.parentNode.id.split('-')[1]);
    let numLikes = parseInt(e.target.nextElementSibling.nextElementSibling.textContent);
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
        .then(data => e.target.nextElementSibling.nextElementSibling.textContent = data.likes)
}

function downVote(e){
    let postId = parseInt(e.target.parentNode.id.split('-')[1]);
    let numLikes = parseInt(e.target.previousElementSibling.previousElementSibling.textContent);
    numLikes--
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
        .then(data => e.target.previousElementSibling.previousElementSibling.textContent = data.likes)
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
    overlay.textContent = getBreed(e);
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

function sortPreference (e) {
    e.target.value == 'newest' ? sortNewest() : fetchSortData()
}

function sortNewest () {
    removeChildren(allPosts)
    fetchData()
}

function fetchSortData () {
    fetch('http://localhost:3000/posts')
    .then((res)=> res.json())
    .then((data) => sortPopularity(data))
}

function sortPopularity (posts) {
    posts.sort((a, b) => {
        return b.likes - a.likes
    })
    removeChildren(allPosts)
    posts.forEach((post) => {
        renderPost(post, 2)
        renderLikes(post)
        renderCommentForm(post)
    })
    fetchComments()
}

//remove all posts before re-rendering when the sort feature is used
function removeChildren (element) {
    let child = element.lastElementChild;
    while (child) {
      element.removeChild(child);
      child = element.lastElementChild;
    }
}

function darkMode(){
    const darkModeButton = document.querySelector("#dark-mode");
     const display = document.querySelector("body");
    darkModeButton.addEventListener("click",()=>{
        if (display.style.backgroundColor === 'lightcyan'){
            display.style.backgroundColor = '#1b1b1b';
            display.style.color = 'white';
            darkModeButton.style.color = "white";
        }else{
            display.style.backgroundColor = 'lightcyan';
            display.style.color = '#1b1b1b';
            darkModeButton.style.color = "#ff579f";
        }
       
})}

//Decodes the JWT (JSON Web Token)
function decodeJwtResponse(data){
    signIn(parseJwt(data))
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

//Show blog post form after sign-in
function signIn (responseData) {
    console.log(responseData.email_verified)
    responseData.email_verified ? showForm() : alert('Please sign in again.')
}

function showForm () {
    document.querySelector('#new-post-form').style.display = 'inline-flex'
    document.querySelector('#sign-in-container').style.display = 'none'
}



