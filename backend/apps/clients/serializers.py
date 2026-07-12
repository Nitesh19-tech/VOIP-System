from rest_framework import serializers

from .models import Client


class ClientSerializer(serializers.ModelSerializer):

    admin_name = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = "__all__"

        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "admin_name",
        )

        extra_kwargs = {
            "admin": {
                "required": False,
                "allow_null": True,
            },
            "email": {
                "required": True,
            },
            "name": {
                "required": True,
            },
            "phone": {
                "required": True,
            },
        }

    def get_admin_name(self, obj):
        if obj.admin:
            return obj.admin.full_name
        return ""

    def validate_email(self, value):
        value = value.lower().strip()

        queryset = Client.objects.filter(
            email__iexact=value
        )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "A client with this email already exists."
            )

        return value