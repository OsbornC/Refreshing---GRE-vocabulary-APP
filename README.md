# Refreshing GRE Flash Cards

## Overview


Remembering the GRE vocabulary is waaaaay too difficult, especially for people who use English as a second language. Also, bringing a vocabulary book everywhere is tiresome. Sooo... that's where Refreshing GRE Flash Cards comes in!

Refreshing GRE Flash Cards is a web app that will allow users to learn GRE vocabulary and take quizzes. Users can register and login. Once they're logged in, they can learn the vocabulary by category. They can take tests on different word lists and see their scores. The words that they do not recognize during the tests will be put in the notes so that they can learn those words from time to time. Once they get full marks for a module test, the progress bar will be updated. Users can also use this web app as a dictionary by looking up words that they do not know on this app. They can also see how many words they still have to remember. In addition, they can add words to this vocabulary if they want.

## Data Model

The application will store Users, Vocabulary and Modules

* users can have multiple lists (via references)
* each list can have multiple items (by embedding)

(___TODO__: sample documents_)

An Example User:

```javascript
{
  user: "Osborn",
  password: // a password hash,
  lists: // an array of references to Modules documents
}
```

An Example Vocabulary:

```javascript
{
  word: "fastidious",
  meaning: "Giving careful attention to detail; hard to please",
  correctness: false, // the user has not been tested on this word or the user fail to recall the meaning of this word during the test
  sentence: "She was too fastidious to do anything that might get her dirty."//    example of how to use this word
}
```

An Example Modules with embedded Vocabulary:

```javascript
{
  portion: 50%, // the portion of times of recognizing words correctly during the test (the best one)
  user: // a reference to a User object
  name: "Module 1",
  vocabulary: [
    {
      word: "fastidious",
      meaning: "Giving careful attention to detail; hard to please",
      correctness: false,
      sentence: "She was too fastidious to do anything that might get her dirty."
    },
    {
      word: "Disingenuous",
      meaning: "not candid or sincere",
      correctness: true,
      sentence: "But shamelessly self-interested and probably contrary to his real views on the EU though it is, the mayor’s move is perhaps not entirely disingenuous."
    }
  ]
}
```


## [Link to Commented First Draft Schema](db.js) 

(___TODO__: create a first draft of your Schemas in db.js and link to it_)

## Wireframes

(___TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc._)

/gre - page for loging in

![list create](documentation/1.jpg)

/gre - page for registering

![list](documentation/6.jpeg)

/gre/lists - page for vocabulary list

![list](documentation/2.jpg)

/gre/quiz - page for quizzes

![list](documentation/3.jpg)

/gre/account - page for account management

![list](documentation/4.jpg)

/gre/lists - page for the dictionary

![list](documentation/5.jpg)

## Site map

(___TODO__: draw out a site map that shows how pages are related to each other_)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

(___TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://www.mongodb.com/download-center?jmp=docs&_ga=1.47552679.1838903181.1489282706#previous)_)

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new grocery list
4. as a user, I can view all of the grocery lists I've created in a single list
5. as a user, I can add items to an existing grocery list
6. as a user, I can cross off items in an existing grocery list

## Research Topics

(___TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed_)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit_)


## [Link to Initial Main Project File](app.js) 

(___TODO__: create a skeleton Express application with a package.json, app.js, views folder, etc. ... and link to your initial app.js_)

## Annotations / References Used

(___TODO__: list any tutorials/references/etc. that you've based your code off of_)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)
