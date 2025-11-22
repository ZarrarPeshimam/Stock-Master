from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from .serializers import UserSignupSerializer, UserLoginSerializer, UserSerializer


class SignupView(GenericAPIView):
    """
    User registration/signup endpoint
    
    POST: Create a new user account
    GET: View the signup form (browsable API will show form automatically)
    """
    permission_classes = [AllowAny]
    serializer_class = UserSignupSerializer
    
    def get(self, request):
        """Show the signup form in browsable API"""
        serializer = self.get_serializer()
        return Response({
            'message': 'User Registration Form',
            'description': 'Fill out the form below to create a new account',
            'fields': {
                'username': 'Required - Unique username',
                'email': 'Required - Valid email address',
                'password': 'Required - Minimum 8 characters',
                'password_confirm': 'Required - Must match password',
                'first_name': 'Optional',
                'last_name': 'Optional'
            },
            'example': {
                'username': 'johndoe',
                'email': 'john@example.com',
                'password': 'securepassword123',
                'password_confirm': 'securepassword123',
                'first_name': 'John',
                'last_name': 'Doe'
            }
        })
    
    def post(self, request):
        """Create a new user"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            # Automatically log in the user after signup
            login(request, user)
            
            # Return user data
            user_serializer = UserSerializer(user)
            return Response({
                'success': True,
                'message': 'User created successfully',
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(GenericAPIView):
    """
    User login endpoint
    
    POST: Authenticate user and log them in
    GET: View the login form (browsable API will show form automatically)
    """
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer
    
    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault('context', {'request': self.request})
        return super().get_serializer(*args, **kwargs)
    
    def get(self, request):
        """Show the login form in browsable API"""
        serializer = self.get_serializer()
        return Response({
            'message': 'User Login Form',
            'description': 'Fill out the form below to login',
            'fields': {
                'username': 'Required - Your username',
                'password': 'Required - Your password'
            },
            'example': {
                'username': 'johndoe',
                'password': 'securepassword123'
            }
        })
    
    def post(self, request):
        """Authenticate and log in user"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Return user data
            user_serializer = UserSerializer(user)
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    Get current user profile
    Requires authentication
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get authenticated user's profile"""
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    User logout endpoint
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Show logout information"""
        return Response({
            'message': 'Logout endpoint',
            'description': 'Click the POST button below to logout',
            'note': 'You must be logged in to logout'
        })
    
    def post(self, request):
        """Log out the current user"""
        logout(request)
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
