from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from contracts.models import Contract
from .models import Message
from .serializers import MessageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied

class MessageHistoryView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        contract_id = self.kwargs["contract_id"]
        contract = Contract.objects.get(id=contract_id)
        user = self.request.user
        if user != contract.proposal.freelancer and user != contract.proposal.project.client:
            raise PermissionDenied("Not allowed")
        return Message.objects.filter(contract=contract).order_by("created_at")
    
from django.utils import timezone
from time import sleep
from datetime import timedelta

class LongPollingMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, contract_id):
        contract = Contract.objects.get(id=contract_id)

        if request.user not in (contract.proposal.freelancer, contract.proposal.project.client):
            raise PermissionDenied("Not allowed")

        last_id = int(request.GET.get("last_id", 0))

        timeout = 25  # seconds
        start = timezone.now()

        while True:
            qs = Message.objects.filter(contract=contract, id__gt=last_id).order_by("id")
            if qs.exists():
                serializer = MessageSerializer(qs, many=True, context={"request": request})
                return Response(serializer.data)

            if timezone.now() - start > timedelta(seconds=timeout):
                return Response([])  # timeout but no new messages

            sleep(1)

class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        print("DEBUG CONTENT-TYPE:", request.content_type)
        print("DEBUG DATA:", request.data)
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        contract_id = self.kwargs["contract_id"]
        contract = Contract.objects.get(id=contract_id)
        user = self.request.user
        if user != contract.proposal.freelancer and user != contract.proposal.project.client:
            raise PermissionDenied("Not allowed")
        serializer.save(contract=contract, sender=user)

# # messaging/views.py
# from rest_framework.generics import CreateAPIView, ListAPIView
# from rest_framework.permissions import IsAuthenticated
# from contracts.models import Contract
# from .models import Message
# from .serializers import MessageSerializer
# from rest_framework.exceptions import PermissionDenied

# class MessageCreateView(CreateAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         contract = Contract.objects.get(id=self.request.data["contract"])

#         if self.request.user not in [contract.proposal.freelancer, contract.proposal.project.client]:
#             raise PermissionDenied("Not your contract")

#         serializer.save(sender=self.request.user)

# class MessageListView(ListAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         contract_id = self.kwargs["contract_id"]
#         contract = Contract.objects.get(id=contract_id)

#         if self.request.user not in [contract.proposal.freelancer, contract.proposal.project.client]:
#             raise PermissionDenied("Not your contract")

#         return Message.objects.filter(contract=contract)
