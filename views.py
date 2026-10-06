from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Profile


# =========================================================
# REGISTER
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    username = request.data.get("username", "").strip()
    email = request.data.get("email", "").strip()
    password = request.data.get("password", "")

    # Validate username
    if not username:
        return Response(
            {"error": "Username is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate password
    if not password:
        return Response(
            {"error": "Password is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 6:
        return Response(
            {"error": "Password must contain at least 6 characters."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check existing username
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create Django user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    # Create candidate profile
    Profile.objects.get_or_create(
        user=user
    )

    # Create authentication token
    token, _ = Token.objects.get_or_create(
        user=user
    )

    return Response(
        {
            "message": "Registration successful.",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        },
        status=status.HTTP_201_CREATED
    )


# =========================================================
# LOGIN
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")

    if not username or not password:
        return Response(
            {
                "error":
                "Username and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate user
    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {
                "error":
                "Invalid username or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Get/create authentication token
    token, _ = Token.objects.get_or_create(
        user=user
    )

    # Make sure profile exists
    Profile.objects.get_or_create(
        user=user
    )

    return Response(
        {
            "message": "Login successful.",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        },
        status=status.HTTP_200_OK
    )


# =========================================================
# CURRENT USER
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):

    user = request.user

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        status=status.HTTP_200_OK
    )


# =========================================================
# LOGOUT
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):

    # Delete the current authentication token
    if request.auth:
        request.auth.delete()

    return Response(
        {
            "message": "Logged out successfully."
        },
        status=status.HTTP_200_OK
    )