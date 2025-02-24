# **AuctionHub: Cloud-Based Online Auction Platform**  

## **Overview**  
AuctionHub is a cloud-based online auction system designed for scalability, reliability, and real-time interaction. Built using **AWS services** such as API Gateway, Lambda, DynamoDB, and Cognito, the platform enables users to **create, list, and bid on auction items securely and efficiently**. The system offers a seamless auction experience, integrating real-time updates, AI-driven descriptions, and intuitive user interactions.  

## **Key Features**  

### **User Registration & Authentication**  
- Secure authentication using **Amazon Cognito**, ensuring **scalability** and **role-based access control**.  
- Email verification and session management for **seamless user experience**.  

  ![User Login](images/signin.png)  
  ![User Registration](images/signup.png)
  ![User Verification](images/emailverify.png)  

### **Auction Management**  
- Sellers can create and manage auctions, specifying item details such as:  
  - Item name, description, starting bid, and images.  
  - Auctions automatically close when bidding ends.  
- Buyers can **browse and participate in real-time bidding**.  

  ![Auction Flow](images/Flow.png)  
  ![Auction Listings](images/liveauc.png)  

### **Real-time Bidding System**  
- Uses **DynamoDB Streams & WebSockets** for instant bid updates.  
- Buyers see live updates on bids, ensuring **dynamic engagement**.  
- Auctions restart if no bids are placed.  
- Placeholder for **Live Auction UI**:  
  ![Live Auctions](images/itemlis2.png)
  ![Live Auctions](images/Itemlis11.png)  

### **Image Upload & Storage**  
- Sellers can upload **auction item images**, which are stored in **Amazon S3**.  
- Images are **converted to base64** for efficient retrieval and storage.  
- Placeholder for **Image Upload UI**:  
  ![Image Upload](images/befen.png)
  
### **AI-Enhanced Item Descriptions**  
- Utilizes **Groq AI** to automatically **generate optimized item descriptions**.  
- Sellers input basic details; AI enhances them to attract more bidders.  
- Placeholder for **AI-Enhanced Description Example**:  
  ![AI Item Description](images/aftehn.png)  
 
### **Real-time Notifications**  
- **DynamoDB Streams trigger AWS Lambda** functions to push notifications.  
- Users receive instant updates when:  
  - A **new highest bid** is placed.  
  - An **auction result is declared**.  
- Placeholder for **Notification UI**:  
  ![Notifications](images/bidnoti.png)  

---

## **System Architecture**  
The system follows a **client-server model** with a clear separation between frontend and backend components:  

![Notification Flow](images/Notify.png)  
![Database Flow](images/DYNDB.png)  
![GroqAI Flow](images/AI.png)  

### **Frontend (React.js)**
- Developed using **React.js**, deployed on **AWS Amplify** for scalability.  
- **Handles all user interactions**, form validation, and API calls.  

### **Backend (Node.js & AWS Lambda)**
- **AWS Lambda functions** process auction, bid, and user requests.  
- **RESTful APIs** exposed through **AWS API Gateway**.  
- **Amazon DynamoDB** used for auction, user, and bid data storage.  

### **Database & Storage**  
- **Auction & item data** stored in **Amazon DynamoDB**.  
- **Auction images** stored in **Amazon S3** with base64 encoding.  

![System Architecture](images/Architecture.png)  

![Database Structure](images/DB.png)  

---

## **API Endpoints**  
| Endpoint                     | HTTP Methods | Description |
|------------------------------|-------------|-------------|
| `/auctions`                  | GET, POST   | Retrieve or create auctions. |
| `/auctions/edit`             | DELETE, PUT | Edit or delete an auction. |
| `/auctions/items/`           | GET, OPTIONS| Retrieve all auction items. |
| `/auctions/items/AI`         | OPTIONS     | Generate AI-enhanced descriptions. |
| `/user-auctions`             | GET, POST, PUT, DELETE | Manage user-specific auctions. |
  
![Buyer](images/Buyer.png)  

![Seller](images/Seller.png)  

## **Workflow**  
### **Auction System Flow**  
1. **User Registration** → Sign up via Cognito.  
2. **Auction Creation** → Seller creates auctions and lists items.  
3. **Real-time Bidding** → Buyers place bids; updates are instant.  
4. **Auction Closing** → Winning bid determined; notifications sent.
   
![Authentication Sequence](images/Authentication.png)  
![Auction Flowchart](images/Flowchart.png)  


---

## **Future Enhancements**  
- **Payment Integration** (Stripe/PayPal) for seamless transactions.  
- **Advanced Analytics** to track bidding trends.  
- **Auto-bidding Feature** for user convenience.  
- **Improved Auction Filtering** (categories, price range, etc.).  

---

## **Conclusion**  
AuctionHub successfully demonstrates the potential of cloud-based solutions for **secure, scalable**, and **real-time auction management**. The integration of **AI, real-time notifications, and serverless architecture** makes it a modern, **high-performance** auction platform. Future updates will further **enhance user engagement and auction efficiency**.  
