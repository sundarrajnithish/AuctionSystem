import json
import boto3
import uuid
from base64 import b64decode
from datetime import datetime, timedelta

# Initialize AWS services
s3_client = boto3.client('s3')
dynamodb_client = boto3.client('dynamodb')

# Define constants
BUCKET_NAME = 'auction-tile-images'  # Replace with your S3 bucket name
TABLE_NAME = 'auctions'  # Replace with your DynamoDB table name

# Decode the base64 image and fix padding
def decode_base64_image(base64_string):
    # Remove spaces or newlines from the base64 string
    base64_string = base64_string.replace(" ", "").replace("\n", "")
    
    # Add padding if necessary (ensure length is a multiple of 4)
    padding = len(base64_string) % 4
    if padding:
        base64_string += "=" * (4 - padding)

    return b64decode(base64_string)

def lambda_handler(event, context):
    try:
        # Parse the incoming JSON body
        body = json.loads(event['body'])
        
        # Generate a random auction ID
        auction_id = str(uuid.uuid4())

        # Extract auction name and user ID (directly from the body)
        auction_name = body.get('auction-name')
        user_id = body.get('user-id')
        
        # Check for required fields
        if not auction_name or not user_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing required fields: auction-name or user-id'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }

        # Extract and decode the base64-encoded image
        title_image_base64 = body.get('titleImage')
        if not title_image_base64:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing title image'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }

        # Decode the base64 image
        image_data = decode_base64_image(title_image_base64)

        # Generate a unique file name for the image
        file_name = f'{auction_id}.jpg'

        # Upload the image to S3
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=image_data,
            ContentType='image/jpeg'
        )

        # Construct the S3 URL for the uploaded image
        img_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}'

        # Set default values for number-of-bids and status
        number_of_bids = 0
        status = 'active'
        description = body.get('description')

        # Set current timestamps for creation and ending
        timestamp_created = datetime.utcnow().isoformat()  # Current UTC time
        timestamp_ending = (datetime.utcnow() + timedelta(minutes=5)).isoformat()  # Ending time after 5 minutes

        # Create a new auction item in DynamoDB
        item = {
            'auction-id': {'S': auction_id},
            'auction-name': {'S': auction_name},
            'img-url': {'S': img_url},
            'number-of-bids': {'N': str(number_of_bids)},
            'status': {'S': status},
            'description': {'S': description},
            'timestamp-created': {'S': timestamp_created},
            'timestamp-ending': {'S': timestamp_ending},
            'user-id': {'S': user_id},
            'registered-users': {'L': []}
        }

        # Put the item into DynamoDB
        dynamodb_client.put_item(
            TableName=TABLE_NAME,
            Item=item
        )

        # Return success response
        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'Auction created successfully!', 'auctionId': auction_id}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error processing the auction'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
