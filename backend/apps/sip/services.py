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
    def generate_username(number):
        """
        Generate SIP extension/username from DID.

        NumberPool no longer stores an extension.
        The SIP username is therefore generated from
        the DID number itself.
        """

        if not number:
            return None

        did = str(
            number.did_number or ""
        ).strip()

        if not did:
            return None

        # Keep digits only
        username = "".join(
            char
            for char in did
            if char.isdigit()
        )

        return username or None

    @staticmethod
    def create_sip(data, user):

        # Company Admin -> auto assign
        if user.role == COMPANY_ADMIN:
            data["admin"] = user

        # Super Admin -> selected admin
        elif user.role == SUPER_ADMIN:
            data["admin"] = data.get("admin")

        number = data.get("number")

        # Auto Username
        if not data.get("username"):

            username = (
                SIPAccountService.generate_username(
                    number
                )
            )

            if not username:
                raise ValueError(
                    "A valid DID number is required to generate SIP username."
                )

            data["username"] = username

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

        if number:

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

        queryset = (
            SIPAccount.objects
            .select_related(
                "admin",
                "client",
                "number",
                "number__country",
            )
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

        queryset = (
            SIPAccount.objects
            .select_related(
                "admin",
                "client",
                "number",
                "number__country",
            )
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
    def update_sip(
        account,
        data,
        user,
    ):

        if user.role == COMPANY_ADMIN:
            data.pop("admin", None)

        old_number = account.number

        # If a new DID is selected and username
        # was not explicitly supplied, generate it.
        new_number = data.get(
            "number",
            old_number,
        )

        if not data.get("username"):

            username = (
                SIPAccountService.generate_username(
                    new_number
                )
            )

            if username:
                data["username"] = username

        # Keep auth_id synchronized when username
        # changes and auth_id was not explicitly supplied.
        if (
            "username" in data
            and not data.get("auth_id")
        ):
            data["auth_id"] = data["username"]

        for key, value in data.items():

            setattr(
                account,
                key,
                value,
            )

        account.save()

        # Number Changed
        if old_number != account.number:

            if old_number:

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

            if account.number:

                account.number.client = (
                    account.client
                )

                account.number.status = (
                    "ASSIGNED"
                )

                account.number.assigned_at = (
                    timezone.now()
                )

                account.number.save(
                    update_fields=[
                        "client",
                        "status",
                        "assigned_at",
                    ]
                )

        elif account.number:

            account.number.client = (
                account.client
            )

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
        if number:

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