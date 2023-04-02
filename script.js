const allPosts = document.querySelector("#blog-posts");

document.addEventListener('DOMContentLoaded', init())

function init () {
    fetchData();
    imageButton()
}

function imageButton () {
    document.querySelector('#new-image-button').addEventListener('click', generateRandom)
    console.log('button clicked')
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
    let numLikes = document.createElement('p')
        

    newContent.textContent = post.content;
    newImg.src = post.image;
    newImg.alt = "dog image";
    newName = post.name;

    let nLikes = parseInt(post.likes);
    numLikes.textContent = nLikes;
    likeBtn.textContent = ("♡")//♥
    likeBtn.addEventListener("click", upvote(nLikes));
    
    

    newPost.append(newName);
    newPost.append(newImg);
    newPost.append(newContent);
    newPost.append(likeBtn);
    newPost.append(numLikes);
    allPosts.append(newPost);
    //need to add comments and create comment form

}

//updating number of likes
function upvote(likes){
    
}