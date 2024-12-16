import json
import boto3

# Initialize API Gateway Management API client for sending messages to connected WebSocket clients
apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url="https://mji36uzzx0.execute-api.ca-central-1.amazonaws.com/production/@connections")

def format_dynamodb_record(dynamodb_record):
    """
    This function converts the DynamoDB format (e.g., 'S', 'N') to a readable format.
    """
    formatted_record = {}
    for key, value in dynamodb_record.items():
        if 'S' in value:
            formatted_record[key] = value['S']
        elif 'N' in value:
            formatted_record[key] = value['N']
        elif 'B' in value:
            formatted_record[key] = value['B']
        elif 'BOOL' in value:
            formatted_record[key] = value['BOOL']
        elif 'M' in value:
            formatted_record[key] = format_dynamodb_record(value['M'])  # Recursively format maps
        elif 'L' in value:
            formatted_record[key] = [format_dynamodb_record(item) if isinstance(item, dict) else item for item in value['L']]
    return formatted_record

def lambda_handler(event, context):
    # Log the received event for debugging purposes
    print("Received event: ", json.dumps(event, indent=2))
    
    # Check if event contains DynamoDB stream records
    if 'Records' in event:
        # Handle DynamoDB Stream event
        for record in event['Records']:
            event_name = record['eventName']
            
            # Get the new and/or old images of the changed item
            if 'NewImage' in record['dynamodb']:
                new_image = format_dynamodb_record(record['dynamodb']['NewImage'])
            else:
                new_image = None
            
            if 'OldImage' in record['dynamodb']:
                old_image = format_dynamodb_record(record['dynamodb']['OldImage'])
            else:
                old_image = None
            
            # Create a message to send to WebSocket clients
            message = {
                'Event': event_name,
                'TableName': record['eventSourceARN'].split('/')[1],  # Extract table name from ARN
                'NewImage': new_image,
                'OldImage': old_image
            }
            
            # Optionally, you can send a message to WebSocket clients
            # Here is how you can send a message to all connected clients (example only)
            try:
                # Example: Send a notification to all clients (replace with actual logic to retrieve connection IDs)
                connection_ids = []  # Replace with logic to retrieve connection IDs from DynamoDB
                for connection_id in connection_ids:
                    apigatewaymanagementapi.post_to_connection(
                        ConnectionId=connection_id,
                        Data=json.dumps(message)  # Sending the DynamoDB change notification
                    )
                print("Messages sent to WebSocket clients.")
            except Exception as e:
                print("Error sending message to WebSocket clients:", e)

    return {
        'statusCode': 200,
        'body': json.dumps('Handled event successfully')
    }
