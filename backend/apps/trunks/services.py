from django.shortcuts import get_object_or_404

from apps.accounts.constants import (
    SUPER_ADMIN,
    COMPANY_ADMIN,
)

# from apps.asterisk.services import ProvisionJobService
# from apps.asterisk.worker import ProvisionWorker

from .models import Trunk


class TrunkService:

    @staticmethod
    def create_trunk(data, user):

        trunk = Trunk.objects.create(
            created_by=user,
            **data,
        )

        # TODO
        # Trunk Provisioning
        #
        # job = ProvisionJobService.create_job(
        #     trunk,
        #     user,
        #     action="CREATE",
        # )
        #
        # ProvisionWorker.run(job)

        return trunk

    @staticmethod
    def get_all(user):

        queryset = Trunk.objects.all()

        if user.role == SUPER_ADMIN:
            return queryset

        if user.role == COMPANY_ADMIN:
            return queryset

        return Trunk.objects.none()

    @staticmethod
    def get_by_id(pk, user):

        queryset = Trunk.objects.all()

        if user.role == SUPER_ADMIN:

            return get_object_or_404(
                queryset,
                pk=pk,
            )

        return get_object_or_404(
            queryset,
            pk=pk,
        )

    @staticmethod
    def update_trunk(trunk, data, user):

        for key, value in data.items():

            setattr(
                trunk,
                key,
                value,
            )

        trunk.save()

        # TODO
        # Trunk Provisioning
        #
        # job = ProvisionJobService.create_job(
        #     trunk,
        #     user,
        #     action="UPDATE",
        # )
        #
        # ProvisionWorker.run(job)

        return trunk

    @staticmethod
    def delete_trunk(trunk):

        # TODO
        # Trunk Delete Provision
        #
        # job = ProvisionJobService.create_job(
        #     trunk,
        #     trunk.created_by,
        #     action="DELETE",
        # )
        #
        # ProvisionWorker.run(job)

        trunk.delete()

        return True