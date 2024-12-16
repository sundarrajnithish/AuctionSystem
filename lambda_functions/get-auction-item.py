import boto3
import json
from boto3.dynamodb.conditions import Attr
from decimal import Decimal
from datetime import datetime, timedelta, timezone

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
        table_name = 'auction-items'  # Table containing auction items
        table = dynamodb.Table(table_name)
        
        # Extract the item-id from query string parameters
        item_id = event.get('queryStringParameters', {}).get('item-id', None)

        if item_id:
            # Use FilterExpression to match item-id
            response = table.scan(
                FilterExpression=Attr('item-id').eq(item_id)
            )
            items = response.get('Items', [])
        else:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "message": "Missing item-id query string parameter"
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
        
        # Check if current bidders array is empty and if timestamp-last-bid is more than 5 minutes old
        if native_items and not native_items[0].get('bidders', []):
            last_timestamp = native_items[0].get('timestamp-listed')
            if last_timestamp:
                # Remove 'Z' if present and convert the string to a datetime object
                if last_timestamp.endswith('Z'):
                    last_timestamp = last_timestamp[:-1] + '+00:00'
                
                # Convert the timestamp-listed string to a datetime object with timezone info
                last_timestamp = datetime.fromisoformat(last_timestamp)
                
                # Ensure current time is aware by using UTC timezone
                current_timestamp = datetime.now(timezone.utc)
                
                # Check if the difference between now and last timestamp is more than 5 minutes
                if current_timestamp - last_timestamp > timedelta(minutes=5):
                    # Update the timestamp-last-bid and timestamp-listed fields
                    table.update_item(
                        Key={'item-id': native_items[0]['item-id']},
                        UpdateExpression="SET #ts = :timestamp, #tl = :timestamp",
                        ExpressionAttributeNames={
                            '#ts': 'timestamp-last-bid',  # Alias for timestamp-last-bid field
                            '#tl': 'timestamp-listed'     # Alias for timestamp-listed field
                        },
                        ExpressionAttributeValues={
                            ':timestamp': current_timestamp.isoformat()  # Use aware datetime
                        }
                    )
        
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
