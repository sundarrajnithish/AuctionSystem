import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')

# Specify your DynamoDB table name
TABLE_NAME = 'auctions'

# Helper function to convert Decimal to standard Python types
def decimal_to_native(obj):
    """
    Recursively converts DynamoDB Decimal objects to int or float.
    """
    if isinstance(obj, list):
        return [decimal_to_native(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: decimal_to_native(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def lambda_handler(event, context):
    """
    Lambda function to fetch auction details by auction-id from query string parameters.
    """
    # Extract auction-id from query string parameters
    auction_id = event.get('queryStringParameters', {}).get('auctionId')

    if not auction_id:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",  # Allow all origins or specify a domain
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"error": "Missing auctionId in query string parameters"})
        }

    # Access the DynamoDB table
    table = dynamodb.Table(TABLE_NAME)

    try:
        # Query the DynamoDB table using auction-id as the key
        response = table.get_item(Key={'auction-id': auction_id})
        item = response.get('Item')

        if not item:
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": "*",  # Allow all origins or specify a domain
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
                "body": json.dumps({"error": "Auction not found"})
            }

        # Convert DynamoDB response to JSON-serializable format
        serialized_item = decimal_to_native(item)

        # Respond with the auction details
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",  # Allow all origins or specify a domain
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps(serialized_item)
        }

    except ClientError as e:
        # Log error and respond with internal server error
        print(f"Error fetching auction details: {e}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",  # Allow all origins or specify a domain
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"error": "Internal server error"})
        }
