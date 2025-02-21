from rest_framework.authtoken.models import Token

def create_api_token(user):
    """
    Create and return an API token for a given user.
    This function can be called when you want to explicitly generate or retrieve the token.
    """
    token, created = Token.objects.get_or_create(user=user)
    return token
