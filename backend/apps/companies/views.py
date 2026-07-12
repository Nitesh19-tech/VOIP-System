from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Company
from .serializers import CompanySerializer
from .services import CompanyService
from apps.accounts.permissions import IsSuperAdmin


class CompanyListCreateAPIView(APIView):

    permission_classes = [IsSuperAdmin]

    def get(self, request):
        companies = CompanyService.get_all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)

        if serializer.is_valid():
            company = CompanyService.create_company(
                serializer.validated_data,
                request.user
            )
            return Response(
                CompanySerializer(company).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class CompanyDetailAPIView(APIView):

    permission_classes = [IsSuperAdmin]

    def get_object(self, pk):
        return CompanyService.get_by_id(pk)

    def get(self, request, pk):
        company = self.get_object(pk)
        serializer = CompanySerializer(company)
        return Response(serializer.data)

    def put(self, request, pk):
        company = self.get_object(pk)

        serializer = CompanySerializer(
            company,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            company = CompanyService.update_company(
                company,
                serializer.validated_data
            )

            return Response(
                CompanySerializer(company).data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        company = self.get_object(pk)
        CompanyService.delete_company(company)
        return Response(status=status.HTTP_204_NO_CONTENT)