import boto3
import json
from boto3.dynamodb.conditions import Attr
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

def decimal_to_native(obj):
    """Convert Decimal objects to native Python types."""
    if isinstance(obj, list):
        return [decimal_to_native(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: decimal_to_native(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        # Convert Decimal to int if it's a whole number, otherwise to float
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def lambda_handler(event, context):
    try:
        # Specify the table name
        table_name = 'auction-items'
        table = dynamodb.Table(table_name)
        
        # Extract the auction-id from query string parameters
        auction_id = event.get('queryStringParameters', {}).get('auction-id', None)

        if auction_id:
            # Use FilterExpression to match auction-id
            response = table.scan(
                FilterExpression=Attr('auction-id').eq(auction_id)
            )
            items = response.get('Items', [])
        else:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "message": "Missing auction-id query string parameter"
                }),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            }
        
        # Convert Decimal to native types
        native_items = decimal_to_native(items)
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Items retrieved successfully",
                "data": native_items
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Error retrieving items",
                "error": str(e)
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        }
