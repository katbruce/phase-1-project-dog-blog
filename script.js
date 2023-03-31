document.addEventListener('DOMContentLoaded', init())

function init () {
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
    newDogImg = document.querySelector('#new-dog-image')
    newDogImg.src = image
}