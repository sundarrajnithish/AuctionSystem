import boto3
import json

# Initialize DynamoDB client
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        # Directly specify the table name here
        table_name = 'auctions'  # Directly set your table name
        
        # Perform the scan operation to fetch all items
        response = dynamodb.scan(TableName=table_name)
        items = response.get('Items', [])
        
        # Return the items in a user-friendly format with CORS headers
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Items retrieved successfully",
                "data": items
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  # Allow any origin
                "Access-Control-Allow-Methods": "GET, OPTIONS",  # Allow GET and OPTIONS methods
                "Access-Control-Allow-Headers": "Content-Type"  # Allow Content-Type header
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
                "Access-Control-Allow-Origin": "*",  # Allow any origin
                "Access-Control-Allow-Methods": "GET, OPTIONS",  # Allow GET and OPTIONS methods
                "Access-Control-Allow-Headers": "Content-Type"  # Allow Content-Type header
            }
        }
