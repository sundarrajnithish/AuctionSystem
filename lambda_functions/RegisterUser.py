import boto3
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('auctions')

def lambda_handler(event, context):
    # Retrieve user ID and auction ID from query string parameters
    user_id = event['queryStringParameters']['user-id']
    auction_id = event['queryStringParameters']['auction-id']

    try:
        # Use update_item to append the user ID to the 'registered-users' list
        response = table.update_item(
            Key={'auction-id': auction_id},
            UpdateExpression="SET #ru = list_append(if_not_exists(#ru, :empty_list), :uid)",
            ExpressionAttributeNames={"#ru": "registered-users"},
            ExpressionAttributeValues={
                ":uid": [user_id],  # Append user_id as a plain string in a list
                ":empty_list": []
            },
            ReturnValues="UPDATED_NEW"
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"message": "User registered successfully", "auction-id": auction_id})
        }

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"message": "Error registering user", "error": str(e)})
        }
