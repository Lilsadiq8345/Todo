import time
import hmac
import hashlib

def generate_agora_token(channel_name, user_id):
    app_id = 'dc01ed3e37014aa5beb55f6b397c5bb0'  # Replace with your Agora App ID
    app_certificate = 'e763ab570e7348388d31e8a701861640'  # Replace with your Agora App Certificate

    expiration_time_in_seconds = 3600  # Token valid for 1 hour
    current_timestamp = int(time.time())
    expire_timestamp = current_timestamp + expiration_time_in_seconds

    privilege = 1  # 1 for publisher (full permissions)

    # Construct the token
    token_string = f"{app_id}{user_id}{channel_name}{expire_timestamp}{privilege}"

    # Generate HMAC SHA1 signature
    signature = hmac.new(
        app_certificate.encode('utf-8'),
        token_string.encode('utf-8'),
        hashlib.sha1
    ).hexdigest()

    return {
        "token": signature,
        "app_id": app_id,
        "channel_name": channel_name,
        "expire_at": expire_timestamp
    }
