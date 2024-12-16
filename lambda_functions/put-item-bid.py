import json
import boto3
from decimal import Decimal
from datetime import datetime

dynamodb = boto3.client('dynamodb')
table_name = "auction-items"

def lambda_handler(event, context):
    try:
        # Validate itemId in queryStringParameters
        item_id = event.get('queryStringParameters', {}).get('itemId')
        if not item_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'itemId is required'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
                }
            }

        # Parse request body and validate bidders and current-bid
        request_body = json.loads(event.get('body', '{}'))
        bidders = request_body.get('bidders', [])
        current_bid = request_body.get('current-bid')

        if not isinstance(bidders, list) or not current_bid:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid request payload'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
                }
            }

        # Convert current_bid to Decimal
        try:
            current_bid = Decimal(current_bid)
        except (ValueError, TypeError):
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'current-bid must be a valid number'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
                }
            }

        # Fetch the existing auction item from DynamoDB
        response = dynamodb.get_item(
            TableName=table_name,
            Key={'item-id': {'S': item_id}}
        )

        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Auction item not found'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
                }
            }

        existing_item = response['Item']

        # Retrieve existing bidders and validate highest bid
        existing_bidders = existing_item.get('bidders', {}).get('L', [])
        max_existing_bid = max(
            (Decimal(bid['M']['bid-amount']['N']) for bid in existing_bidders),
            default=Decimal(0)
        )

        if current_bid <= max_existing_bid:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'New bid must be greater than the current highest bid'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
                }
            }

        # Validate bidder ID from the last bid in the request
        last_bidder = bidders[-1] if bidders else {}
        bidder_id = last_bidder.get('bidder-id')

        if not bidder_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Bidder ID is required'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
                }
            }

        # Append new bidder information to existing bidders
        new_bid = {
            "M": {
                "bidder-id": {"S": bidder_id},
                "bid-amount": {"N": str(current_bid)}
            }
        }
        updated_bidders = existing_bidders + [new_bid]

        # Find the highest bidder
        highest_bidder = max(
            updated_bidders,
            key=lambda bid: Decimal(bid['M']['bid-amount']['N'])
        )
        winner_id = highest_bidder['M']['bidder-id']['S']

        # Set timestamp for last bid
        timestamp_last_bid = datetime.utcnow().isoformat()

        # Update the auction item in DynamoDB
        dynamodb.update_item(
            TableName=table_name,
            Key={'item-id': {'S': item_id}},
            UpdateExpression="SET #b = :b, #c = :c, #t = :t, #w = :w",
            ExpressionAttributeNames={
                "#b": "bidders",
                "#c": "current-bid",
                "#t": "timestamp-last-bid",
                "#w": "winner"
            },
            ExpressionAttributeValues={
                ':b': {'L': updated_bidders},
                ':c': {'N': str(current_bid)},
                ':t': {'S': timestamp_last_bid},
                ':w': {'S': winner_id}
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Bid placed successfully'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
            }
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
            }
        }
