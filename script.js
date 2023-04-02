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
    
    newPost.className = 'blog-post';
    newPost.id = `post-${post.id}`
    newContent.textContent = post.content;
    newImg.src = post.image;
    newImg.alt = "dog image";
    newName = post.name;

    let nLikes = parseInt(post.likes);
    numLikes.className = 'like-count'
    numLikes.textContent = nLikes;
    likeBtn.textContent = ("♡");//♥
    likeBtn.addEventListener("click", upvote);
    
    newPost.append(newName, newImg, newContent, likeBtn, numLikes);
    allPosts.append(newPost);

    // newPost.append(newName);
    // newPost.append(newImg);
    // newPost.append(newContent);
    // newPost.append(likeBtn);
    // newPost.append(numLikes);
    // allPosts.append(newPost);
    //need to add comments and create comment form

}

//updating number of likes
function upvote(e){
    postId = parseInt(e.target.parentNode.id.split('-')[1]);
    numLikes = parseInt(e.target.nextElementSibling.textContent);
    numLikes++
    let blogObj = {
        id: postId,
        likes: numLikes
    };
    console.log(blogObj)
    fetch (`http://localhost:3000/posts/${postId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(blogObj)
    })
        .then(res => res.json())
        .then(data => e.target.nextElementSibling.textContent = data.likes)
}