from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .constants import COMPANY_ADMIN


User = get_user_model()


class UserService:

    @staticmethod
    def create_user(validated_data):
        password = validated_data.pop("password", None)

        user = User(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()

        return user

    
    @staticmethod
    def get_all_users():
        return (
        User.objects
        .filter(role=COMPANY_ADMIN)
        .order_by("-created_at")
        )
    
    @staticmethod
    def get_user(user_id):
        return get_object_or_404(
            User,
            id=user_id
        )

    @staticmethod
    def update_user(user, validated_data):
        password = validated_data.pop("password", None)

        for key, value in validated_data.items():
            setattr(user, key, value)

        if password:
            user.set_password(password)

        user.save()

        return user

    @staticmethod
    def delete_user(user):
        user.delete()