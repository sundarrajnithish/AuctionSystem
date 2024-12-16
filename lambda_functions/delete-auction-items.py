import boto3
import json

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        # Get the auction-id from the path parameters
        auction_id = event['queryStringParameters']['auction-id']

        # Initialize the DynamoDB table
        table = dynamodb.Table('auctions')

        # Delete the auction item from DynamoDB
        response = table.delete_item(Key={'auction-id': auction_id})

        # Check if the item was deleted successfully
        if response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 200:
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Auction deleted successfully"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Auction not found"})
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error deleting auction", "error": str(e)})
        }
