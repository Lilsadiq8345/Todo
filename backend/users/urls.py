from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, UserListView, UserRetrieveUpdateDestroyView, TaskListCreateView, TaskRetrieveUpdateDestroyView, NotificationListView, LogoutView

urlpatterns = [
    # User-related endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='user-list'),  # Admin can list all users
    path('users/<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),  # Admin can view, update, delete users

    # Token refresh endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Logout endpoint
    path('logout/', LogoutView.as_view(), name='logout'),

    # Task-related endpoints
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'),

    # Notification-related endpoint
    path('notifications/', NotificationListView.as_view(), name='notifications'),
]
