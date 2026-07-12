from .models import Company


class CompanyService:

    @staticmethod
    def create_company(data, user):
        return Company.objects.create(
            created_by=user,
            **data
        )

    @staticmethod
    def get_all():
        return Company.objects.all()

    @staticmethod
    def get_by_id(pk):
        return Company.objects.get(pk=pk)

    @staticmethod
    def update_company(company, data):

        for key, value in data.items():
            setattr(company, key, value)

        company.save()

        return company

    @staticmethod
    def delete_company(company):
        company.delete()