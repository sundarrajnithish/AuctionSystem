import json
import boto3
import base64
import uuid
from botocore.exceptions import ClientError
from io import BytesIO

# Initialize DynamoDB and S3 clients
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
table = dynamodb.Table('auction-items')
bucket_name = 'auctionhub-items-images'  # Replace with your S3 bucket name

def lambda_handler(event, context):
    try:
        # Extract item data from the event (this should come from the POST request body)
        item_data = json.loads(event['body'])  # Assuming the event body contains a JSON payload
        
        item_id = str(uuid.uuid4())  # Generate a unique item ID
        auction_id = item_data['auction-id']
        item_name = item_data['item-name']
        description = item_data['description']
        current_bid = item_data['current-bid']
        starting_bid = item_data['starting-bid']
        seller_id = item_data['seller-id']
        bidder_id = item_data.get('bidder-id', '')  # Optional bidder ID
        timestamp_last_bid = item_data['timestamp-last-bid']
        timestamp_listed = item_data['timestamp-listed']
        base64_image = item_data['img-url']  # Base64 string of the image
        
        # Decode the base64 string to binary data
        image_data = base64.b64decode(base64_image)
        
        # Generate a unique file name for the image
        image_filename = f"{item_id}.jpg"  # You can change the extension as needed
        
        # Upload the image to S3
        s3.put_object(Bucket=bucket_name, Key=image_filename, Body=image_data, ContentType='image/jpeg')
        
        # Generate the S3 URL for the uploaded image
        img_url = f"https://{bucket_name}.s3.amazonaws.com/{image_filename}"

        # Prepare the item to be inserted into DynamoDB
        item = {
            'item-id': item_id,
            'auction-id': auction_id,
            'item-name': item_name,
            'description': description,
            'img-url': img_url,  # Store the S3 URL instead of base64 data
            'current-bid': current_bid,
            'starting-bid': starting_bid,
            'seller-id': seller_id,
            'bidder-id': bidder_id,
            'timestamp-last-bid': timestamp_last_bid,
            'timestamp-listed': timestamp_listed
        }

        # Insert the item into DynamoDB
        table.put_item(Item=item)

        # Return a success response with CORS headers
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Item successfully added to auction!',
                'item-id': item_id
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins (can be limited to specific origins)
                'Access-Control-Allow-Methods': 'OPTIONS,POST',  # Allowed HTTP methods
                'Access-Control-Allow-Headers': 'Content-Type'  # Allow content-type header
            }
        }

    except ClientError as e:
        # Handle DynamoDB client errors
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error adding item to auction: {e.response["Error"]["Message"]}'
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # CORS header
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
    
    except Exception as e:
        # Handle general errors
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Unexpected error: {str(e)}'
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # CORS header
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    return response
