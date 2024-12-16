import boto3
import json
from decimal import Decimal
from uuid import uuid4

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        # Parse the incoming JSON body
        body = json.loads(event['body'])

        # Create a new auction ID and populate auction details
        auction_id = f"auction-{str(uuid4())}"
        user_id = body['user-id']
        auction_name = body['auction-name']
        img_url = body['img-url']
        starting_bid = body['starting-bid']
        description = body['description']
        status = body['status']
        timestamp_created = body['timestamp-created']
        timestamp_ending = body['timestamp-ending']

        # Initialize the DynamoDB table
        table = dynamodb.Table('auctions')

        # Create a new auction item
        new_auction = {
            'auction-id': auction_id,
            'auction-name': auction_name,
            'user-id': user_id,
            'img-url': img_url,
            'starting-bid': Decimal(str(starting_bid)),
            'description': description,
            'status': status,
            'timestamp-created': timestamp_created,
            'timestamp-ending': timestamp_ending
        }

        # Insert the auction into DynamoDB
        table.put_item(Item=new_auction)

        return {
            "statusCode": 201,
            "body": json.dumps({"message": "Auction created successfully", "auction-id": auction_id}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error creating auction", "error": str(e)})
        }
