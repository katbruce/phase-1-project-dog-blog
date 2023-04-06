# Dog Blog

## Overview
Dog Blog is a social media platform allowing users to like, dislike and comment on dog images, along with posting their own with images sourced from Random Dog API. Users can login using Google Authentication or as a guest user. 

## Features
- sign in with Google 
- dynamically upvote and downvote
- commenting
- night mode
- desktop and mobile friendly

## Installation
Dog blog is run solely on local servers. To run, two commands are needed to run the site with Google sign in, and it must be in the project working directory. 

In one terminal, paste into the command line: 
>json-server --watch db.json --routes routes.json 
>(this loads the server in port 3000)
In a seperate terminal, without closing the previous port, paste into the command line: 
>python3 -m http.server 
>(this loads an html server on port 8000)

Lastly, navigate to http://localhost:8000 in your browser. 
---
## Acknowledgements
Project created for our Phase 1 Project for Flatiron School Denver. Team members were:
[Mike Marcoux](https://github.com/mikecoux)
[Kathryn Bruce](https://github.com/katbruce)