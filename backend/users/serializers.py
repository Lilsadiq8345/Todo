from rest_framework import serializers
from .models import CustomUser, Task,  Notification
from django.contrib.auth.hashers import make_password


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'status', 'is_completed', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        # Check if 'is_completed' is being updated
        if 'is_completed' in validated_data:
            is_completed = validated_data.get('is_completed', instance.is_completed)

            # Auto-update status based on is_completed value
            if is_completed:
                validated_data['status'] = 'completed'
            else:
                validated_data['status'] = 'pending'

        return super().update(instance, validated_data)

    def create(self, validated_data):
        user = self.context['request'].user  # Get user from request context
        # Remove 'user' from validated_data if it exists
        validated_data.pop('user', None)
        return Task.objects.create(user=user, **validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']

