from rest_framework import serializers
from .models import Contract


class ContractSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField(read_only=True)
    client = serializers.StringRelatedField(read_only=True)
    freelancer = serializers.StringRelatedField(read_only=True)

    review_exists = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = (
            "id",
            "project",
            "client",
            "freelancer",
            "bid_amount",
            "start_date",
            "end_date",
            "is_active",
            "progress",
            "review_exists",
        )

    def get_review_exists(self, obj):
        return hasattr(obj, "review")
