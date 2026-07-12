from django.shortcuts import get_object_or_404
from django.utils import timezone

import secrets
import string

from apps.accounts.constants import (
    SUPER_ADMIN,
    COMPANY_ADMIN,
)

from apps.asterisk.services import ProvisionJobService
from apps.asterisk.worker import ProvisionWorker

from .models import SIPAccount


class SIPAccountService:

    @staticmethod
    def generate_password():
        chars = (
            string.ascii_letters
            + string.digits
            + "@#$%&"
        )

        return "".join(
            secrets.choice(chars)
            for _ in range(12)
        )

    @staticmethod
    def create_sip(data, user):

        # Company Admin -> auto assign
        if user.role == COMPANY_ADMIN:
            data["admin"] = user

        # Super Admin -> selected admin
        elif user.role == SUPER_ADMIN:
            data["admin"] = data.get("admin")

        # Auto Username
        if not data.get("username"):
            data["username"] = data["number"].extension

        # Auto Auth ID
        if not data.get("auth_id"):
            data["auth_id"] = data["username"]

        # Auto Password
        if not data.get("password"):
            data["password"] = (
                SIPAccountService.generate_password()
            )

        account = SIPAccount.objects.create(
            created_by=user,
            **data,
        )

        # Assign Number
        number = account.number
        number.client = account.client
        number.status = "ASSIGNED"
        number.assigned_at = timezone.now()

        number.save(
            update_fields=[
                "client",
                "status",
                "assigned_at",
            ]
        )

        # Provision Job
        job = ProvisionJobService.create_job(
            account,
            user,
            action="CREATE",
        )

        ProvisionWorker.run(job)

        return account

    @staticmethod
    def get_all(user):

        queryset = SIPAccount.objects.select_related(
            "admin",
            "client",
            "number",
            "number__country",
        )

        if user.role == SUPER_ADMIN:
            return queryset

        if user.role == COMPANY_ADMIN:
            return queryset.filter(
                admin=user
            )

        return SIPAccount.objects.none()

    @staticmethod
    def get_by_id(pk, user):

        queryset = SIPAccount.objects.select_related(
            "admin",
            "client",
            "number",
            "number__country",
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
    def update_sip(account, data, user):

        if user.role == COMPANY_ADMIN:
            data.pop("admin", None)

        old_number = account.number

        for key, value in data.items():
            setattr(account, key, value)

        account.save()

        # Number Changed
        if old_number != account.number:

            old_number.client = None
            old_number.status = "AVAILABLE"
            old_number.assigned_at = None

            old_number.save(
                update_fields=[
                    "client",
                    "status",
                    "assigned_at",
                ]
            )

            account.number.client = account.client
            account.number.status = "ASSIGNED"
            account.number.assigned_at = timezone.now()

            account.number.save(
                update_fields=[
                    "client",
                    "status",
                    "assigned_at",
                ]
            )

        else:

            account.number.client = account.client

            account.number.save(
                update_fields=[
                    "client",
                ]
            )

        # Provision Job
        job = ProvisionJobService.create_job(
            account,
            user,
            action="UPDATE",
        )

        ProvisionWorker.run(job)

        return account

    @staticmethod
    def delete_sip(account):

        number = account.number

        # Release Number
        number.client = None
        number.status = "AVAILABLE"
        number.assigned_at = None

        number.save(
            update_fields=[
                "client",
                "status",
                "assigned_at",
            ]
        )

        # Provision Job
        job = ProvisionJobService.create_job(
            account,
            account.created_by,
            action="DELETE",
        )

        ProvisionWorker.run(job)

        account.delete()