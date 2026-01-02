# ThreadUD - Student Forum Mobile App

A full-stack mobile forum for TU Dublin students with real-time updates and AI-powered content moderation.

## Problem Statement

Enable academic discussion among students with real-time communication while maintaining a safe environment through automated and manual content moderation.

## Features

- **Real-time Updates:** Socket.io for instant post/comment notifications
- **Content Moderation:** Google Perspective API for toxicity detection
- **Authentication:** bcrypt hashing + 2FA via email verification
- **Admin Dashboard:** Flag review, user management, content removal
- **RESTful API:** Express.js with MongoDB (Mongoose ODM)

## Architecture

### System Flow
```
React Native App (Mobile Client)
        ↓
    Socket.io (WebSocket)
        ↓
Node.js/Express Server
        ↓
    MongoDB (Database)
        
External APIs:
- Perspective API (content moderation)
- Nodemailer (email notifications)
```
### Key Implementation
#### Real-time Messaging:
```
// Server
io.on('connection', (socket) => {
  socket.on('new-post', (post) => {
    io.emit('post-created', post);
  });
});

// Client
socket.on('post-created', (post) => {
  updatePostList(post);
});
```
#### Content Moderation:
```
javascriptconst moderateContent = async (text) => {
  const response = await perspectiveAPI.analyze({
    comment: { text },
    requestedAttributes: { TOXICITY: {} }
  });
  
  const toxicity = response.attributeScores.TOXICITY.summaryScore.value;
  return toxicity > 0.7 ? 'flagged' : 'approved';
};
```
## Testing
### Stress Testing (Locust)

- Simulated 100 concurrent users
- Tested post creation, comment threads, real-time updates
- Identified bottlenecks in database queries

### User Testing

- 15+ participants on college open day
- Tested UX/UI, feature discovery, performance
- Gathered feedback for improvements

## Results

- Real-time sync across multiple clients without race conditions
- Automated moderation flagging inappropriate content pre-submission
- Scalability validated through stress testing
- Secure authentication with bcrypt + 2FA + input sanitization

## Technologies
- Frontend: React Native, Socket.io-client
- Backend: Node.js, Express, Socket.io, Mongoose
- Database: MongoDB
- APIs: Perspective API (Google), Nodemailer
- Testing: Locust, Jest, user testing
