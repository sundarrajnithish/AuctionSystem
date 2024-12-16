import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    # Get user-id and auction-id from query parameters
    user_id = event['queryStringParameters']['user-id']
    auction_id = event['queryStringParameters']['auction-id']

    if not user_id or not auction_id:
        return {
            'statusCode': 400,
            "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            'body': json.dumps({'message': 'Missing user-id or auction-id'})
        }

    # Log for debugging purposes
    print(f"Attempting to deregister user {user_id} from auction {auction_id}")

    # Fetch auction record from DynamoDB using get_item
    try:
        response = dynamodb.get_item(
            TableName='auctions',
            Key={
                'auction-id': {'S': auction_id}
            }
        )

        # Log the auction response for debugging
        print(f"Auction response: {response}")

        # Check if auction exists and has registered users
        if 'Item' not in response or 'registered-users' not in response['Item']:
            return {
                'statusCode': 404,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                'body': json.dumps({'message': 'Auction not found or no registered users'})
            }

        # Extract registered users and check if the user is registered
        registered_users = [user['S'] for user in response['Item']['registered-users']['L']]
        if user_id not in registered_users:
            return {
                'statusCode': 404,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                'body': json.dumps({'message': 'User not registered for this auction'})
            }

        # Fetch all auction items related to this auction-id using scan
        auction_items_response = dynamodb.scan(
            TableName='auction-items',
            FilterExpression='#auction_id = :auction_id',
            ExpressionAttributeNames={
                '#auction_id': 'auction-id'
            },
            ExpressionAttributeValues={
                ':auction_id': {'S': auction_id}
            }
        )

        # Log the auction items response for debugging
        print(f"Auction items response: {auction_items_response}")

        # Check if the user is a bidder or seller in any of the auction items
        for item in auction_items_response['Items']:
            bidder_ids = [bid['M']['bidder-id']['S'] for bid in item.get('bidders', {}).get('L', [])]
            seller_id = item.get('seller-id', {}).get('S', '')
            current_bid = int(item['current-bid']['N'])

            # Check if user has the highest bid
            highest_bid = max(int(bid['M']['bid-amount']['N']) for bid in item.get('bidders', {}).get('L', []))
            
            if user_id in bidder_ids and highest_bid == current_bid:
                return {
                    'statusCode': 400,
                    "headers": {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    'body': json.dumps({'message': 'User has the highest bid and cannot deregister'})
                }

            if user_id == seller_id:
                return {
                    'statusCode': 400,
                    "headers": {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    'body': json.dumps({'message': 'User is a  seller and cannot deregister'})
                }

        # Remove the user from the registered-users list
        updated_registered_users = [user for user in registered_users if user != user_id]

        # Update the auction record in DynamoDB
        update_response = dynamodb.update_item(
            TableName='auctions',
            Key={
                'auction-id': {'S': auction_id}
            },
            UpdateExpression='SET #ru = :ru',
            ExpressionAttributeNames={
                '#ru': 'registered-users'
            },
            ExpressionAttributeValues={
                ':ru': {'L': [{'S': user} for user in updated_registered_users]}
            },
            ReturnValues='UPDATED_NEW'
        )

        return {
            'statusCode': 200,
            "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            'body': json.dumps({'message': 'Deregistration successful!'})
        }

    except Exception as e:
        print(f"Error during deregistration: {e}")
        return {
            'statusCode': 500,
            "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            'body': json.dumps({'message': 'Failed to deregister from auction', 'error': str(e)})
        }
