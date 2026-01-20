from django.urls import re_path
from ..messages.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/contracts/(?P<contract_id>\d+)/$", ChatConsumer.as_asgi()),
]
