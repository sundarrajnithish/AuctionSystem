import boto3
import json
import os

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = "auctions"

def lambda_handler(event, context):
    # Extract user-id from the query string parameters
    user_id = event.get('queryStringParameters', {}).get('user-id')
    
    if not user_id:
        return {
            "statusCode": 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({"error": "user-id query parameter is required"})
        }

    table = dynamodb.Table(TABLE_NAME)

    try:
        # Scan the table to find items where the registered-users list contains the user-id
        response = table.scan()
        items = response.get('Items', [])

        # Collect all matching auction IDs
        matching_auctions = [
            item['auction-id'] for item in items
            if user_id in item.get('registered-users', [])
        ]

        return {
            "statusCode": 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({
                "auction-ids": matching_auctions,
                "isRegistered": len(matching_auctions) > 0
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({"error": str(e)})
        }
