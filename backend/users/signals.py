from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Task, Notification

@receiver(post_save, sender=Task)
def task_completion_notification(sender, instance, **kwargs):
    if instance.status == "completed":  # Ensure task is completed
        # Create a notification
        Notification.objects.create(
            user=instance.user,
            message=f"Your task '{instance.title}' has been marked as completed."
        )

        # Send email notification
        send_mail(
            subject="Task Completed",
            message=f"Hello {instance.user.username},\n\nYour task '{instance.title}' has been marked as completed.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[instance.user.email],
            fail_silently=False,
        )
