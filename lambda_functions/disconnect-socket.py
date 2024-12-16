import json
import boto3

dynamodb = boto3.resource('dynamodb')
connection_table = dynamodb.Table('WebSocketConnections')

def lambda_handler(event, context):
    connection_id = event['requestContext']['connectionId']
    route_key = event['requestContext']['routeKey']
    
    if route_key == '$connect':
        # Add connectionId to DynamoDB
        connection_table.put_item(Item={'connectionId': connection_id})
        return {'statusCode': 200}
    
    elif route_key == '$disconnect':
        # Remove connectionId from DynamoDB
        connection_table.delete_item(Key={'connectionId': connection_id})
        return {'statusCode': 200}
