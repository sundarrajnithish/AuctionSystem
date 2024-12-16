import json
import boto3

dynamodb = boto3.resource('dynamodb')
websocket_table = dynamodb.Table('WebSocketConnections')
apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', 
                                       endpoint_url="https://m95cq5efai.execute-api.ca-central-1.amazonaws.com/production")

def send_message_to_all_clients(message):
    # Retrieve all WebSocket connection IDs from DynamoDB
    response = websocket_table.scan()
    connection_ids = [item['connectionId'] for item in response['Items']]
    
    for connection_id in connection_ids:
        try:
            apigatewaymanagementapi.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps(message)
            )
        except Exception as e:
            print(f"Error sending message to {connection_id}: {str(e)}")

def format_dynamodb_record(record):
    # Convert DynamoDB stream format to a readable dictionary
    formatted_record = {}
    for key, value in record.items():
        if 'S' in value:
            formatted_record[key] = value['S']
        elif 'N' in value:
            formatted_record[key] = value['N']
        elif 'BOOL' in value:
            formatted_record[key] = value['BOOL']
        elif 'M' in value:
            formatted_record[key] = format_dynamodb_record(value['M'])
        elif 'L' in value:  # Handle lists
            formatted_record[key] = []
            for v in value['L']:
                if 'M' in v:  # If it's a map (nested dictionary)
                    formatted_record[key].append(format_dynamodb_record(v['M']))
                else:
                    # If it's a simple value, just take the first element
                    formatted_record[key].append(list(v.values())[0])
    return formatted_record

def lambda_handler(event, context):
    for record in event['Records']:
        # Get the event details
        event_name = record['eventName']
        new_image = record['dynamodb'].get('NewImage', {})
        old_image = record['dynamodb'].get('OldImage', {})
        
        # Identify the source table from the ARN
        table_arn = record['eventSourceARN']
        table_name = table_arn.split('/')[1]  # Extract table name from ARN
        
        # Format the data
        message = {
            'Event': event_name,
            'SourceTable': table_name,  # Include the table name in the message
            'NewImage': format_dynamodb_record(new_image),
            'OldImage': format_dynamodb_record(old_image),
        }
        
        # Handle logic based on the table name
        if table_name == 'auction-items':
            print(f"Processing event from 'auction-items': {message}")
            # Add logic specific to 'auction-items' if needed
        elif table_name == 'auctions':
            print(f"Processing event from 'auctions': {message}")
            # Add logic specific to 'auctions' if needed
        
        # Send the message to WebSocket clients
        send_message_to_all_clients(message)
    
    return {'statusCode': 200, 'body': 'Message sent.'}
