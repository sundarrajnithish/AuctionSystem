import os
import json
import boto3
import sys
import subprocess

# Install groq package to /tmp/ directory and add to path
subprocess.call('pip install groq -t /tmp/ --no-cache-dir'.split(), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
sys.path.insert(1, '/tmp/')

from groq import Groq

def lambda_handler(event, context):
    # Initialize the Groq client with the API key from the environment variable
    groq_api_key = os.environ.get("groq_api_key")
    if not groq_api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({"error": "Missing Groq API key in environment variables."})
        }

    client = Groq(api_key=groq_api_key)
    
    # Retrieve the productId from query string parameters
    query_params = event.get('queryStringParameters', {})
    keywords = query_params.get('keywords')
    typeDescription = query_params.get('type')
        
    if not keywords:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({"error": "Invalid or missing 'keywords' in query parameters"})
        }

    if not typeDescription or typeDescription not in ['1', '2']:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({"error": "Invalid or missing 'type' in query parameters. Must be '1', or '2'."})
        }
    
    try:
        # Define the message content for Groq
        if keywords and typeDescription:
            if typeDescription=="1":
                messages = [
                {"role": "system", "content": "You will receive a vague auction description, change that into a short, professionally writtern auction description stating what the auction is about. Give a plain unformatted paragraph with no bold letters or newlines."},
                {"role": "user", "content": keywords}
            ]
            elif typeDescription=="2":
                messages = [
                    {"role": "system", "content": "You will receive a vague product description, change that into a brief, professionally writtern product description that is going to be listed in an Auction website. Give a plain unformatted paragraph with no bold letters or newlines."},
                    {"role": "user", "content": keywords}
                ]
        
        # Send to Groq's API
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192"
        )
        
        # Extract response text
        response_text = chat_completion.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({"description": response_text})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({"error": f"Internal server error: {str(e)}"})
        }
