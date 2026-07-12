from rest_framework.permissions import BasePermission

from .constants import (
    SUPER_ADMIN,
    COMPANY_ADMIN,
    CLIENT,
)


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == SUPER_ADMIN
        )


class IsCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == COMPANY_ADMIN
        )


class IsClient(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == CLIENT
        )


class IsSuperAdminOrCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                SUPER_ADMIN,
                COMPANY_ADMIN,
            ]
        )