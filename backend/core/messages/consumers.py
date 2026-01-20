import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import PermissionDenied
from contracts.models import Contract
from .models import Message

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.contract_id = self.scope["url_route"]["kwargs"]["contract_id"]
        self.room_group_name = f"contract_{self.contract_id}"

        user = self.scope["user"]
        contract = await self.get_contract()

        if user.is_anonymous or not await self.is_user_in_contract(user, contract):
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()


    async def receive(self, text_data):
        data = json.loads(text_data)
        body = data.get("body", "")

        user = self.scope["user"]
        contract = await self.get_contract()

        msg = await self.create_message(contract, user, body)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": {
                    "id": msg.id,
                    "sender": user.id,
                    "sender_name": user.username,
                    "body": msg.body,
                    "timestamp": str(msg.timestamp),
                    "attachment": msg.attachment.url if msg.attachment else None,
                },
            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )


    @database_sync_to_async
    def get_contract(self):
        return Contract.objects.get(id=self.contract_id)

    @database_sync_to_async
    def is_user_in_contract(self, user, contract):
        return (
            user == contract.proposal.freelancer or
            user == contract.proposal.project.client
        )

    @database_sync_to_async
    def create_message(self, contract, user, body):
        return Message.objects.create(
            contract=contract,
            sender=user,
            body=body,
        )
