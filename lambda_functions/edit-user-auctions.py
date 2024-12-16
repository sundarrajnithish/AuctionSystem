import boto3
import json
from decimal import Decimal

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        # Parse the auction-id and new data from the request
        auction_id = event['pathParameters']['auction-id']
        body = json.loads(event['body'])

        # Initialize the DynamoDB table
        table = dynamodb.Table('auctions')

        # Get the current auction data from DynamoDB
        response = table.get_item(Key={'auction-id': auction_id})
        
        if 'Item' not in response:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Auction not found"})
            }

        # Get the existing auction and update fields
        existing_auction = response['Item']
        updated_auction = {**existing_auction, **body}

        # Update the auction in DynamoDB
        table.put_item(Item=updated_auction)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Auction updated successfully"}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error updating auction", "error": str(e)})
        }
