# relevel-twitter-backend-nodejs

# Objectives Achieved

The APIs implement the functionalities defined in the user stories, apart from a few other ones needed to run the backend smoothly

- Story 1 - Successfully stores the users and tweets in their respective MongoDB documents. The schema for both is normalised to make sure there are minmal redundacies and all appropriate data types have been used. Also the tweets and users are coupled, so when a user is deleted all his tweets are also automatically deleted.

- Story 2 - The "/tweet" endpoint takes the parameters - user_id, username and tweet_body to create a new tweet for a user. All protected methods for eg. liking a tweet, deleting a user require the "Authorization" header to be set with a valid token, and deals with the failure of meeting this condition with apprpriate HTTP status codes and methods.

# Code Structure

- common - Contains all code common to each module of the backend
- config - Exports a bunch of environment variables
- controllers - Methods that hook up to routers and modify the MongoDB Collection for performing actions
- models - The schema for users and tweets, along with utility function(s) for MongoDB
- routes - The routes, actual enpoints for communicating with the app

# Known Issues

- `mongoose` throws TextEndcoder() not defined error. Since this needs modification of node_modules, it can be done manually using the solution here
  https://stackoverflow.com/questions/19697858/referenceerror-textencoder-is-not-defined
