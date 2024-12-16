import boto3
import json
from decimal import Decimal
from boto3.dynamodb.conditions import Key

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def decimal_to_native(obj):
    """Convert Decimal objects to native Python types."""
    if isinstance(obj, Decimal):
        # Convert Decimal to int if it's a whole number, otherwise to float
        return int(obj) if obj % 1 == 0 else float(obj)
    elif isinstance(obj, list):
        return [decimal_to_native(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: decimal_to_native(v) for k, v in obj.items()}
    return obj

def lambda_handler(event, context):
    try:
        # Extract the user-id from query string parameters
        user_id = event.get('queryStringParameters', {}).get('user-id', None)

        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing user-id query string parameter"})
            }

        # Initialize the DynamoDB table
        table = dynamodb.Table('auctions')
        
        # Query DynamoDB for auctions created by the specified user-id
        response = table.scan(
            FilterExpression=Key('user-id').eq(user_id)
        )
        
        # Extract items from the response
        items = response.get('Items', [])
        
        if not items:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "No auctions found for the specified user-id"})
            }

        # Convert DynamoDB JSON format to a user-friendly format, handling Decimals
        formatted_items = [decimal_to_native(item) for item in items]

        # Return the items in a user-friendly format
        return {
            "statusCode": 200,
            "body": json.dumps({"auctions": formatted_items}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }
    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error fetching auctions", "error": str(e)})
        }
