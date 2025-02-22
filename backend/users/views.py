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


# ✅ List All Users
class UserList(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        users = User.objects.filter(user_type='user')  
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


# ✅ Task List & Creation
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title']  
    filterset_fields = ['status']  

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

def perform_create(self, serializer):
    serializer.save(user=self.request.user)


# ✅ Task Details, Update, Delete & Mark as Completed
class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        status_value = self.request.data.get("status")
        task = serializer.save()

        if status_value and status_value.lower() == "completed":
            task.status = "completed"
            task.save()

            # ✅ Create Notification
            notification = Notification.objects.create(
                user=task.user,
                message=f"Your task '{task.title}' has been marked as completed."
            )

            # ✅ Send Email
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
