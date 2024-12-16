import json
import boto3
import uuid
from base64 import b64decode
from datetime import datetime

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
        # Ensure 'queryStringParameters' exists and contains 'auctionId'
        query_string_params = event.get('queryStringParameters')
        if not query_string_params or 'auctionId' not in query_string_params:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Auction ID is missing in query string parameters'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }

        # Extract auction ID from query string parameters
        auction_id = query_string_params['auctionId']
        
        # Parse the incoming JSON body safely
        if 'body' not in event or not event['body']:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Request body is missing or empty'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }
        body = json.loads(event['body']) if event['body'] else {}

        # Extract auction name, description, user ID, and image
        auction_name = body.get('auction-name')
        description = body.get('description')
        user_id = body.get('user-id')
        title_image_base64 = body.get('titleImage')
        
        # Validate required fields
        if not auction_name or not user_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing required fields: auction-name or user-id'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }

        # Decode the base64 image if it exists
        img_url = None
        if title_image_base64:
            image_data = decode_base64_image(title_image_base64)
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

        # Set current timestamps for updating
        timestamp_updated = datetime.utcnow().isoformat()

        # Update auction item in DynamoDB
        update_expression = "SET #auction_name = :auction_name, description = :description, #timestamp_updated = :timestamp_updated"
        expression_attribute_values = {
            ':auction_name': {'S': auction_name},
            ':description': {'S': description},
            ':timestamp_updated': {'S': timestamp_updated}
        }
        
        if img_url:
            update_expression += ", #img_url = :img_url"
            expression_attribute_values[':img_url'] = {'S': img_url}
        
        # ExpressionAttributeNames to map special characters
        expression_attribute_names = {
            '#auction_name': 'auction-name',
            '#timestamp_updated': 'timestamp-updated',
            '#img_url': 'img-url'
        }

        dynamodb_client.update_item(
            TableName=TABLE_NAME,
            Key={'auction-id': {'S': auction_id}},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Auction updated successfully!'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error updating the auction'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
