from django.utils import timezone

from .models import ProvisionJob


class ProvisionJobService:

    @staticmethod
    def create_job(sip_account, user, action="CREATE"):

        return ProvisionJob.objects.create(
            sip_account=sip_account,
            created_by=user,
            action=action,
            status="PENDING",
        )

    @staticmethod
    def start_job(job):

        job.status = "RUNNING"
        job.started_at = timezone.now()
        job.save(
            update_fields=[
                "status",
                "started_at",
            ]
        )

        return job

    @staticmethod
    def complete_job(job, message="Provision completed successfully."):

        job.status = "SUCCESS"
        job.message = message
        job.completed_at = timezone.now()

        job.save(
            update_fields=[
                "status",
                "message",
                "completed_at",
            ]
        )

        return job

    @staticmethod
    def fail_job(job, error):

        job.status = "FAILED"
        job.error = str(error)
        job.retry_count += 1
        job.completed_at = timezone.now()

        job.save(
            update_fields=[
                "status",
                "error",
                "retry_count",
                "completed_at",
            ]
        )

        return job

    @staticmethod
    def pending_jobs():

        return ProvisionJob.objects.filter(
            status="PENDING"
        ).order_by("created_at")