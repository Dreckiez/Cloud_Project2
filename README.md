# Task Manager — Serverless Cloud Architecture
A fully serverless, zero-cost web application built with a native AWS backend and an HTML/CSS/JS frontend. This project demonstrates event-driven compute, NoSQL database integration, and secure content delivery.

**Architecture & Tech Stack**
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Compute:** AWS Lambda (Node.js)
- **API Routing:** Amazon API Gateway (REST API)
- **Database:** Amazon DynamoDB
- **Hosting & CDN:** Amazon S3 + Amazon CloudFront (with OAC)

## How to Run Locally
Because the production architecture relies on managed cloud services, local development uses a custom vanilla Node.js mock server with an in-memory array to simulate the API and database.

**1. Start the Mock Backend** <br>
Open your terminal, navigate to the backend directory, and start the local server.

```Bash
node server.js
```

*Note: The server will run on `http://localhost:3000` and handle all CORS and CRUD operations using mock data.*

**2. Serve the Frontend** <br>
Since the frontend uses ES6 modules, open the project in Visual Studio Code and use the **Live Server** extension.

- Right-click on index.html.

- Select **"Open with Live Server"**.

**3. View the App** <br>
Your browser will automatically open (typically to `http://127.0.0.1:5500`). The frontend will now communicate seamlessly with the local Node.js backend.

## How to Deploy to AWS <br>
This project is deployed entirely via the AWS Management Console. Follow these steps to replicate the infrastructure.

**Phase 1: Database (Amazon DynamoDB)** <br>
1. Navigate to DynamoDB and create a new table named `TaskTable`.

2. Set the Partition Key to `taskId` (String).

3. Leave all other settings as default (Provisioned capacity, Free Tier eligible).

**Phase 2: Compute (AWS Lambda)** <br>
1. Navigate to AWS Lambda and create four separate Node.js functions for the CRUD operations (e.g., `CreateTask`, `GetTasks`, `UpdateTask`, `DeleteTask`).

2. Attach an IAM Role to each function that includes the AWSLambdaBasicExecutionRole and permissions to perform `dynamodb:PutItem`, `dynamodb:Scan`, `dynamodb:UpdateItem`, and `dynamodb:DeleteItem` on the `TaskTable` ARN.

3. Deploy the provided Node.js code into each respective function. Ensure CORS headers (`Access-Control-Allow-Origin`) are included in both the successful `200` return statements and the `500` catch blocks.

**Phase 3: Routing (Amazon API Gateway)** <br>
1. Create a new REST API in API Gateway.

2. Create a `/tasks` resource.

3. Under `/tasks`, create GET and POST methods using Lambda Proxy Integration, pointing them to your `GetTasks` and `CreateTask` functions.

4. Create a child resource with a path parameter: `/tasks/{id}`.

5. Under `/tasks/{id}`, create `PUT` and `DELETE` methods, pointing them to `UpdateTask` and `DeleteTask`.

6. Click the `/tasks` resource and select Enable CORS to allow browser requests.

7. Deploy the API to a stage named `prod` and copy the Invoke URL.

**Phase 4: Frontend Hosting & CDN (Amazon S3 & CloudFront)** <br>
1. Update `api.js` in your local frontend code with the new API Gateway Invoke URL.

2. Create an Amazon S3 bucket. Keep Block all public access enabled. Do not enable Static Website Hosting.

3. Upload all frontend files (`index.html`, `app.js`, `api.js`, `service.js`, `style.css`) to the S3 bucket.

4. Navigate to CloudFront and create a new distribution.

5. Select the S3 bucket as the Origin.

6. Under Origin Access, select Origin access control settings (OAC) and create a control policy to allow CloudFront to securely access the private S3 bucket.

7. Set the Default Root Object to `index.html`.

8. Create the distribution, copy the generated S3 Bucket Policy, and apply it to your S3 bucket's permissions.

9. Access the live application via the generated CloudFront Domain Name.