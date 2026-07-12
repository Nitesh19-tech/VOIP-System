from django.shortcuts import get_object_or_404
from django.db import transaction
from django.contrib.auth import get_user_model

import secrets
import string

from apps.accounts.constants import (
    CLIENT,
    COMPANY_ADMIN,
    SUPER_ADMIN,
)

from .models import Client

User = get_user_model()


class ClientService:

    @staticmethod
    @transaction.atomic
    def create_client(data, user):

        # Company Admin -> auto assign
        if user.role == COMPANY_ADMIN:
            data["admin"] = user

        # Super Admin -> selected admin or None
        elif user.role == SUPER_ADMIN:
            data["admin"] = data.get("admin")

        client = Client.objects.create(
            created_by=user,
            **data
        )

        # User already exists?
        if User.objects.filter(email=client.email).exists():
            raise ValueError(
                "A user with this email already exists."
            )

        # Default Password (Development)
        password = "Client@123"

        login_user = User.objects.create(
            first_name=client.name,
            email=client.email,
            mobile=client.phone,
            role=CLIENT,
            is_active=True,
            force_password_change=True,
        )

        login_user.set_password(password)
        login_user.save()

        return {
            "client": client,
            "password": password,
        }

    @staticmethod
    def get_all(user):

        queryset = Client.objects.select_related(
            "admin"
        )

        if user.role == SUPER_ADMIN:
            return queryset

        if user.role == COMPANY_ADMIN:
            return queryset.filter(
                admin=user
            )

        return Client.objects.none()

    @staticmethod
    def get_by_id(pk, user):

        queryset = Client.objects.select_related(
            "admin"
        )

        if user.role == SUPER_ADMIN:
            return get_object_or_404(
                queryset,
                pk=pk,
            )

        return get_object_or_404(
            queryset,
            pk=pk,
            admin=user,
        )

    @staticmethod
    def update_client(client, data, user):

        # Company Admin cannot change owner
        if user.role == COMPANY_ADMIN:
            data.pop("admin", None)

        for key, value in data.items():
            setattr(client, key, value)

        client.save()

        return client

    @staticmethod
    def delete_client(client):
        client.delete()