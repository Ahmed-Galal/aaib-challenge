#AAIB challenge

* In AAIB we are communicating with our customers through notifications. 

- We are sending credit
card points to our customers via sms , also we are sending notifications to our customers after
transactions like "the transfer has been submitted". 
- customers view notifications through the App. 
- each customer receives a notification with preferred language.


- specifications:

   - some notifications are sent by sms.
   - some notifications will be sent via push notifications to mobile.
   - we have two types of notifications:
      - Group notification which is sent as a text notification to a group of users.
      - The personalized notification which is sent as a specific text notification to each user.
   - The number of requests that providers (SMS, Email) can handle per minute are limited.


- Requirements :

    - Design and implement the notification schema.
    - Implement notification service which handles the database changes and sends
    notifications for customers.
    - Service should be run by docker-compose up.
    - Document your APIs.
    - Test your code using unit tests. Use Nodejs for your implementation.
  
#### NOTE: 
    you don’t need to integrate with Real SMS Provider.
    shouldn't exceed 5 days
