from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from users.models import User

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"].decode()
        qs = parse_qs(query_string)
        token = qs.get("token", [None])[0]

        scope["user"] = AnonymousUser()

        if token:
            try:
                access = AccessToken(token)
                user = await database_sync_to_async(User.objects.get)(id=access["user_id"])
                scope["user"] = user
            except Exception:
                pass

        return await self.inner(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
