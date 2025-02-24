from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions, filters
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from django.conf import settings

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, TaskSerializer, NotificationSerializer
from .models import Task, Notification

User = get_user_model()


# ✅ Register View
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Login View
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

            user = authenticate(username=user.username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_type': user.user_type,
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ List All Users (Admin only)
class UserListView(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get_queryset(self):
        # Check if the user is an admin based on the `user_type`
        if self.request.user.user_type == 'admin':
            return User.objects.all()  # Admin can view all users
        return User.objects.none()  # Non-admin users cannot view other users

    def perform_create(self, serializer):
        # Optionally, assign user roles (if needed)
        serializer.save()


# ✅ User Details, Update, Delete (Admin only)
class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get_queryset(self):
        # Check if the user is an admin based on the `user_type`
        if self.request.user.user_type == 'admin':
            return User.objects.all()  # Admin can view, update, or delete users
        return User.objects.none()  # Non-admin users cannot perform these actions

# ✅ Task List & Creation with Filtering (Admin and User can create tasks)
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title']
    filterset_fields = ['status']

    def get_queryset(self):
        # Admin can view all tasks, regular users can only view their own tasks
        if self.request.user.user_type == 'admin':
            return Task.objects.all()
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Ensure only the logged-in user can create tasks for themselves
        if self.request.user.user_type != 'admin':
            serializer.save(user=self.request.user)
        else:
            serializer.save()


# ✅ Task Details, Update, Delete & Mark as Completed
class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.user_type == 'admin':
            return Task.objects.all()
        return Task.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        task = serializer.save()
        status_value = self.request.data.get("status")

        if status_value and status_value.lower() == "completed":
            task.status = "completed"
            task.save()

            # ✅ Create Notification
            Notification.objects.create(
                user=task.user,
                message=f"Your task '{task.title}' has been marked as completed."
            )

            # ✅ Send Email Notification
            send_mail(
                subject="Task Completed",
                message=f"Hello {task.user.username},\n\nYour task '{task.title}' has been marked as completed.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[task.user.email],
                fail_silently=False,
            )


# ✅ List User Notifications
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


# ✅ User Logout
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
