# Thread UD

ThreadUD is a mobile forum-based application made to promote academic conversation and peer learning among TUD students.

This app is being developed with React Native expo, made for students at TUD to permote academic conversation and peer learning

It uses a combination of a react native front end, a dedicatied node.js back end server which uses express and mongoose to interact with a Mongo DB database, storing app information

It also uses Googles Persepctive API, to verify that comments and posts contain appropriate content for this learning enviroment

The app includes a Home page and thread page where posts form different "Threads" are displayed, a post page which displays posts and comments, a profile page with user data which can be updated and pages to make posts, make threads, search for threads and other profile management pages

The app also features admin pages, for handling content in the database that has been flagged by Perspective API

The app uses bcrypt to hash user passwords, nodemailer so send passcodes during forgot password verification and will soon feature ai moderation of all posts and comments

Users are provided many ways in which they can interact with the app, including following their favorite threads, creating their own posts and threads, comment on posts, and like posts and comments
