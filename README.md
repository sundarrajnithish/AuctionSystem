# Auction System in the Cloud

This project implements a cloud-based **Auction System (AS)**, providing Software-as-a-Service (SaaS) to end-users. It enables users to register, offer items for auction, and bid on items, with real-time updates and competitive bidding. Built with **React** and leveraging various **AWS services**, the system is designed for scalability, elasticity, and a seamless user experience.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The Auction System enables registered users to offer items for sale and bid on other users' items. Auctions run for a fixed period (5 minutes per item), and users receive real-time updates on the highest bid for each item. At the end of the auction period, the item is sold to the highest bidder. This system includes:
- User registration and authentication
- Real-time auction updates
- Dynamic bidding functionality
- Notification of auction outcomes

## Architecture

The project architecture includes several **AWS services** integrated with a **React** front-end, supporting user interaction and data management. Here’s a breakdown of the key AWS components:

1. **AWS Amplify**: Manages the deployment and configuration of our front-end.
2. **Amazon Cognito**: Provides user authentication and authorization.
3. **Amazon DynamoDB**: Stores auction data, including user profiles, items for auction, and bid history.
4. **AWS API Gateway**: Acts as the API layer, managing requests and connecting the front-end to the back-end.
5. **AWS Lambda**: Hosts serverless functions for handling the business logic, such as bid submission and auction status updates.
6. **Amazon S3**: Stores static assets, including images of auction items.

## Technologies

- **Frontend**: React, JavaScript, CSS
- **Backend**: AWS Lambda (Node.js)
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito
- **Hosting & Deployment**: AWS Amplify, Amazon S3
- **API Management**: AWS API Gateway

## Features

- **User Registration**: Users can register with unique usernames and manage their profiles.
- **Item Listing for Auction**: Registered users can list items for auction with a description and images.
- **Real-Time Bidding**: Users can place bids, with the system notifying all participants of current highest bids.
- **Winner Notification**: At the end of each auction, the system notifies the winner and the item owner.
- **Auction Management**: Unsuccessful auctions are restarted, giving items more opportunities to attract bids.

## Setup Instructions

To set up and run the Auction System locally, follow these steps:

### Prerequisites

- Node.js (v14+)
- AWS Account

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/auction-system
    cd auction-system
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure AWS Amplify**:
   Set up Amplify and link it to your AWS account:
    ```bash
    amplify init
    amplify add auth
    amplify add api
    amplify push
    ```

4. **Configure AWS services**:
   - Set up **Amazon Cognito** for user authentication.
   - Configure **DynamoDB** tables for storing auction items, user data, and bid history.
   - Use **API Gateway** and **Lambda** functions for handling bidding logic and auction management.
   - Set up **S3** for static file hosting and **Amplify** for front-end deployment.

5. **Run the application**:
    ```bash
    npm start
    ```

The application should now be running on `http://localhost:3000`.

## Usage

Once set up, users can:
- Register or log in with **Amazon Cognito**.
- List items for auction and view all active listings.
- Place bids and receive real-time updates on current highest bids.
- Receive notifications on the results of each auction.

## Contributing

We welcome contributions! Please follow these steps to submit a pull request:
1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request with a description of your changes.

## License

This project is licensed under the MIT License.

---

This README covers the essential setup and configuration steps for an AWS-integrated auction system based on the provided project details.
