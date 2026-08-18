from rest_framework import serializers

from .models import SIPAccount


class SIPAccountSerializer(serializers.ModelSerializer):

    admin_name = serializers.CharField(
        source="admin.full_name",
        read_only=True,
    )

    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    did_number = serializers.CharField(
        source="number.did_number",
        read_only=True,
    )

    # SIP extension is now the SIP username.
    # NumberPool no longer contains an extension field.
    extension = serializers.CharField(
        source="username",
        read_only=True,
    )

    country_name = serializers.CharField(
        source="number.country.name",
        read_only=True,
    )

    dial_code = serializers.CharField(
        source="number.country.dial_code",
        read_only=True,
    )

    provider = serializers.CharField(
        source="number.provider",
        read_only=True,
    )

    class Meta:

        model = SIPAccount

        fields = [

            "id",

            "admin",
            "admin_name",

            "client",
            "client_name",

            "number",

            "did_number",
            "extension",

            "country_name",
            "dial_code",

            "provider",

            "username",
            "password",
            "auth_id",

            "domain",
            "transport",
            "context",

            "caller_id",

            "codecs",

            "nat",
            "qualify",

            "status",

            "created_by",
            "created_at",
            "updated_at",

        ]

        read_only_fields = (

            "id",

            "created_by",
            "created_at",
            "updated_at",

            "admin_name",
            "client_name",

            "did_number",
            "extension",

            "country_name",
            "dial_code",

            "provider",

        )

        extra_kwargs = {

            "admin": {
                "required": False,
                "allow_null": True,
            },

            "client": {
                "required": True,
            },

            "number": {
                "required": False,
                "allow_null": True,
            },

            "username": {
                "required": False,
                "allow_blank": True,
            },

            "password": {
                "required": False,
                "allow_blank": True,
            },

            "auth_id": {
                "required": False,
                "allow_blank": True,
            },

            "domain": {
                "required": False,
            },

            "context": {
                "required": False,
            },

            "caller_id": {
                "required": False,
                "allow_blank": True,
            },

            "codecs": {
                "required": False,
            },

            "nat": {
                "required": False,
            },

            "qualify": {
                "required": False,
            },

            "status": {
                "required": False,
            },

        }

    def validate(self, attrs):

        number = attrs.get(
            "number",
            getattr(
                self.instance,
                "number",
                None,
            ) if self.instance else None,
        )

        # =====================================================
        # DID VALIDATION
        # =====================================================

        if number:

            queryset = SIPAccount.objects.filter(
                number=number,
            )

            if self.instance:

                queryset = queryset.exclude(
                    pk=self.instance.pk,
                )

            if queryset.exists():

                raise serializers.ValidationError({

                    "number":
                    "This DID number is already linked with another SIP Account."

                })

            # =================================================
            # AUTO GENERATE SIP CREDENTIALS
            # =================================================

            did_number = str(
                number.did_number or ""
            ).strip()

            username = "".join(
                char
                for char in did_number
                if char.isdigit()
            )

            if not username:

                raise serializers.ValidationError({

                    "number":
                    "The selected DID does not contain a valid number."

                })

            attrs["username"] = username

            attrs["auth_id"] = username

            attrs["caller_id"] = did_number

            if not attrs.get("password"):

                attrs["password"] = username

        else:

            # =================================================
            # MANUAL SIP ACCOUNT
            # =================================================

            if not attrs.get("username"):

                raise serializers.ValidationError({

                    "username":
                    "Username is required when DID is not selected."

                })

            if not attrs.get("auth_id"):

                attrs["auth_id"] = (
                    attrs["username"]
                )

            if not attrs.get("caller_id"):

                attrs["caller_id"] = (
                    attrs["username"]
                )

        # =====================================================
        # DEFAULT VALUES
        # =====================================================

        attrs.setdefault(
            "domain",
            "pbx.local",
        )

        attrs.setdefault(
            "transport",
            "UDP",
        )

        attrs.setdefault(
            "context",
            "from-internal",
        )

        attrs.setdefault(
            "codecs",
            "ulaw,alaw",
        )

        attrs.setdefault(
            "nat",
            True,
        )

        attrs.setdefault(
            "qualify",
            True,
        )

        attrs.setdefault(
            "status",
            "ACTIVE",
        )

        return attrs

    def create(
        self,
        validated_data,
    ):

        return SIPAccount.objects.create(
            **validated_data,
        )

    def update(
        self,
        instance,
        validated_data,
    ):

        for key, value in validated_data.items():

            setattr(
                instance,
                key,
                value,
            )

        instance.save()

        return instance