from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .permissions import IsSuperAdmin
from .serializers import (
    LoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    LogoutSerializer,
    UserSerializer,
)
from .services import UserService

class LoginAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Login Successful",

                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },

                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            },
            status=status.HTTP_200_OK
        )

class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserProfileSerializer(request.user)

        return Response(serializer.data)

    def put(self, request):

        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Profile Updated",
                "data": serializer.data,
            }
        )

class ChangePasswordAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(
            serializer.validated_data["old_password"]
        ):
            return Response(
                {
                    "success": False,
                    "message": "Old password is incorrect."
                },
                status=400
            )

        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save()

        return Response(
            {
                "success": True,
                "message": "Password changed successfully."
            }
        )

class LogoutAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Logout successful."
            }
        )

class UserListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        users = UserService.get_all_users()

        serializer = UserSerializer(users, many=True)

        return Response({
            "success": True,
            "data": serializer.data
        })

    def post(self, request):

        serializer = UserSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = UserService.create_user(serializer.validated_data)

        return Response(
            {
                "success": True,
                "message": "User created successfully.",
                "data": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class UserDetailAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request, pk):

        user = UserService.get_user(pk)

        return Response({
            "success": True,
            "data": UserSerializer(user).data
        })

    def put(self, request, pk):

        user = UserService.get_user(pk)

        serializer = UserSerializer(
            user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        user = UserService.update_user(
            user,
            serializer.validated_data,
        )

        return Response({
            "success": True,
            "message": "User updated successfully.",
            "data": UserSerializer(user).data,
        })

    def delete(self, request, pk):

        user = UserService.get_user(pk)

        UserService.delete_user(user)

        return Response(
            {
                "success": True,
                "message": "User deleted successfully."
            }
        )