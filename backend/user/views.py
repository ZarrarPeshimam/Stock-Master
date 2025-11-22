import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from .serializers import UserSignupSerializer, UserLoginSerializer, UserSerializer

# Get logger for this module
logger = logging.getLogger(__name__)


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
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        logger.info(f"[SIGNUP] GET request - Signup form accessed from IP: {ip_address}")
        print(f"[SIGNUP] GET request - Signup form accessed from IP: {ip_address}")
        
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
        username = request.data.get('username', 'Unknown')
        email = request.data.get('email', 'Unknown')
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        
        logger.info(f"[SIGNUP] POST request - Attempting to create user: {username}, Email: {email}, IP: {ip_address}")
        print(f"[SIGNUP] POST request - Attempting to create user: {username}, Email: {email}, IP: {ip_address}")
        
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            # Automatically log in the user after signup
            login(request, user)
            
            logger.info(f"[SIGNUP] SUCCESS - User created and logged in: {user.username} (ID: {user.id}), Email: {user.email}")
            print(f"[SIGNUP] SUCCESS - User created and logged in: {user.username} (ID: {user.id}), Email: {user.email}")
            
            # Return user data
            user_serializer = UserSerializer(user)
            return Response({
                'success': True,
                'message': 'User created successfully',
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        logger.warning(f"[SIGNUP] FAILED - Validation errors for username: {username}, Errors: {serializer.errors}")
        print(f"[SIGNUP] FAILED - Validation errors for username: {username}, Errors: {serializer.errors}")
        
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
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        logger.info(f"[LOGIN] GET request - Login form accessed from IP: {ip_address}")
        print(f"[LOGIN] GET request - Login form accessed from IP: {ip_address}")
        
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
        username = request.data.get('username', 'Unknown')
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        
        logger.info(f"[LOGIN] POST request - Login attempt for username: {username}, IP: {ip_address}")
        print(f"[LOGIN] POST request - Login attempt for username: {username}, IP: {ip_address}")
        
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            logger.info(f"[LOGIN] SUCCESS - User logged in: {user.username} (ID: {user.id}), Email: {user.email}")
            print(f"[LOGIN] SUCCESS - User logged in: {user.username} (ID: {user.id}), Email: {user.email}")
            
            # Return user data with tokens
            user_serializer = UserSerializer(user)
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': user_serializer.data,
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                }
            }, status=status.HTTP_200_OK)
        
        logger.warning(f"[LOGIN] FAILED - Invalid credentials for username: {username}, IP: {ip_address}")
        print(f"[LOGIN] FAILED - Invalid credentials for username: {username}, IP: {ip_address}")
        
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
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        logger.info(f"[PROFILE] GET request - Profile accessed by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[PROFILE] GET request - Profile accessed by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        serializer = UserSerializer(user)
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request):
        """Update authenticated user's profile"""
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        logger.info(f"[PROFILE] PUT request - Profile update by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[PROFILE] PUT request - Profile update by user: {user.username} (ID: {user.id}), IP: {ip_address}")
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"[PROFILE] SUCCESS - Profile updated for user: {user.username} (ID: {user.id})")
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        logger.warning(f"[PROFILE] FAILED - Validation errors for user: {user.username}, Errors: {serializer.errors}")
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    User logout endpoint
    Works with both GET and POST requests - directly logs out the user
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Log out the current user (GET request)"""
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        
        logger.info(f"[LOGOUT] GET request - User logout: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[LOGOUT] GET request - User logout: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        logout(request)
        
        logger.info(f"[LOGOUT] SUCCESS - User logged out: {user.username} (ID: {user.id})")
        print(f"[LOGOUT] SUCCESS - User logged out: {user.username} (ID: {user.id})")
        
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Log out the current user (POST request)"""
        user = request.user
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        
        logger.info(f"[LOGOUT] POST request - User logout: {user.username} (ID: {user.id}), IP: {ip_address}")
        print(f"[LOGOUT] POST request - User logout: {user.username} (ID: {user.id}), IP: {ip_address}")
        
        logout(request)
        
        logger.info(f"[LOGOUT] SUCCESS - User logged out: {user.username} (ID: {user.id})")
        print(f"[LOGOUT] SUCCESS - User logged out: {user.username} (ID: {user.id})")
        
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)


class TokenRefreshViewCustom(TokenRefreshView):
    """
    Custom token refresh view that returns success message
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return Response({
                'success': True,
                'message': 'Token refreshed successfully',
                'tokens': response.data
            }, status=status.HTTP_200_OK)
        return response
