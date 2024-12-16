import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('auctions')  # Replace 'Auctions' with your table name

def lambda_handler(event, context):
    # Retrieve auctionId from query string parameters
    auction_id = event.get('queryStringParameters', {}).get('auctionId')

    if not auction_id:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins (use more specific origin in production)
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',  # Allowed HTTP methods
                'Access-Control-Allow-Headers': 'Content-Type',  # Allowed headers
            },
            'body': json.dumps({'message': 'Auction ID is required'})
        }

    # Prepare DynamoDB delete parameters
    try:
        response = table.delete_item(
            Key={
                'auction-id': auction_id  # Replace 'auction-id' with your partition key name
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins (use more specific origin in production)
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',  # Allowed HTTP methods
                'Access-Control-Allow-Headers': 'Content-Type',  # Allowed headers
            },
            'body': json.dumps({'message': f'Auction with ID {auction_id} deleted successfully'})
        }

    except Exception as e:
        print(f"Error deleting auction: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins (use more specific origin in production)
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',  # Allowed HTTP methods
                'Access-Control-Allow-Headers': 'Content-Type',  # Allowed headers
            },
            'body': json.dumps({'message': 'Failed to delete auction', 'error': str(e)})
        }
