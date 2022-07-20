# BYTETOOLS WEB APPLICATION

## How it is solved now:
Client will send a job request, with the files and deadline, to Bytetools via email/discord. After receiving the request, Bytetools will notify all their transcribers of a new job by email/discord. Transcribers will claim a job by responding to the notification and then they will transcribe the job and submit it to reviewers also through email/discord. The reviewers, after reviewing the job and making changes accordingly, will upload and send the final document to the client via discord/email.

## Client’s need:
The client wants a web application to divide this work between its transcribers and reviewers and maintain communication of jobs through the app. This app will allow clients to submit job requests and track its status through the app. The centralization of all the job requests on one application will keep jobs organized, and workflow efficient. When a new job becomes available,the application will send email and discord notifications to the appropriate job handlers at Bytetools, as well as clients when a job is complete.

### How would the project make the client's life better?

The current system that Bytetools uses has many drawbacks. Every time a client needs a new job, they have to email it themselves to Bytetools. Also, the distribution of jobs is unorganized and has a long wait time before someone can claim a job. This is because transcribers and reviewers are not notified as quickly when a new job is available to them. It is harder for Bytetools to track all of its ongoing jobs and their statuses using their email system. 
With our application, the client can submit job requests and view their status as it is processed. Clients will be notified accordingly through discord/email with status updates. Then the application will send a notification to all transcribers as soon as a new job they can work on is posted. The transcriber will be able to download the file from the application and upload a transcribed file and submit it to be reviewed. The transcriber will be able to view job information about their current jobs. This will help keep jobs more organized and workflow more efficient. When a document is ready for review, reviewers will also be notified and claim the job that they want. They can then download the document and make changes and upload a final copy and submit it to the client directly through the web app. The client will then be notified that the job has been completed and be able to download the end product from the application. With our application, the job requests will be organized and processed in a timely manner, instead of it being in a disorganized email system. This distribution and notifications of jobs will be automated through our system allowing for a more efficient workflow, and ease of use for clients.

## Features:

### Authentication system 
The application will validate users and their roles. This will protect data from being exposed to unauthorized users, by using user authentication tokens. There will be four roles in our system, client, reviewer, transcribers and admin. Admins will be able to view all users and jobs, assign roles, and delete users and jobs.
	
### Job Distribution system
The application will keep a database of all open and in-progress jobs. This application will show all jobs available based on a user's role, and will be prioritized from earliest to latest deadline. Claimed jobs will be hidden from other users except for the user who claimed the job and the admin. This will keep the job requests organized and free of clutter for other users. If the transcriber or client would like to abandon a job they can do so.

### File system
The application will allow users to upload and download files for jobs. These files will be kept in  cloud storage and can only be accessed through our server with proper authentication. Bytetools employees will be able to download and upload files to our system within a reasonable file size to prevent using up too much storage. Clients will be able to upload files themselves and download the final product through our system. Clients will also have a log of all their past job requests available for download.

### Discord & Email notification system
The application will send notifications of new jobs available to reviewers and transcribers through discord/email in less than a few minutes. This can either be a message onto a chat board or private message through a discord bot. The client will be able to subscribe to status updates from our system to notify them through email of the process of the job requests and when it is completed.


## APIs for Application:

**EMAIL API:**	
https://sendgrid.com/ 
limits: 100 emails/ day

**DISCORD API:** 
https://discord.js.org
limits: 50 requests per second per bot

# scripts to get started (development purposes only)
#### npm i
*~run this in the root folder to install all depenedencies for backend and client (must do this before running any other commands)*
#### npm run dev
*~run this command to run both the server(port 5000) and client(port 3000) simultaneously* 
#### npm run server
*~run this command to run the server on port 5000*
#### npm run client
*~run this command to run the client on port 3000*

remember to run "heroku ps:scale web=1" to turn app on in heroku
