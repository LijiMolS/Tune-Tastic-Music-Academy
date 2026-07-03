from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import uuid

# -----------------------------
# Profile Model
# ----------------------------    -
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)

    MEMBERSHIP_CHOICES = [
        ('free', 'Free User'),
        ('standard', 'Standard User'),
        ('premium', 'Premium User'),
    ]

    membership = models.CharField(
        max_length=20,
        choices=MEMBERSHIP_CHOICES,
        default='free'
    )

    def __str__(self):
        return self.user.username


# Automatically create Profile when a User is created
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# Automatically save Profile when User is saved
@receiver(post_save, sender=User)
def create_or_save_profile(sender, instance, created, **kwargs):
    Profile.objects.get_or_create(user=instance)

# -----------------------------
# Course Model
# -----------------------------
class Course(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


# -----------------------------
# UserSubscription Model
# -----------------------------
class UserSubscription(models.Model):
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    courses = models.ManyToManyField(Course, blank=True)
    active = models.BooleanField(default=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)

    def is_active(self):
        return self.active

    def __str__(self):
        return f"{self.user.username} - {self.plan}"


# -----------------------------
# CourseActivity Model
# -----------------------------
class CourseActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time_spent_minutes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.course.name} ({self.date})"
    


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject[:30]}"


class EarTrainingProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_score = models.IntegerField(default=0)
    date_completed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.total_score}/10"

class ChordMelodyProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_score = models.IntegerField(default=0)
    date_completed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.total_score}/10"

class RhythmProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_score = models.PositiveIntegerField(default=0)
    date_completed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.total_score}/10"

class Practice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duration = models.IntegerField()  # seconds
    date = models.DateField(auto_now_add=True)
    
class LiveSession(models.Model):
    title = models.CharField(max_length=100)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    zoom_link = models.URLField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=[('upcoming','Upcoming'), ('live','Live'), ('ended','Ended')])

from django.utils import timezone
from .models import LiveSession

def update_status(session):
    now = timezone.now()

    if session.start_time <= now <= session.end_time:
        session.status = "live"
    elif now > session.end_time:
        session.status = "ended"
    else:
        session.status = "upcoming"

    session.save()

from django.db import models
from django.contrib.auth.models import User

class PracticeSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # ⏱️ Session timing
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    # ⏳ Duration in seconds
    duration = models.IntegerField(default=0)

    # 📅 Auto date
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.formatted_duration()}"

    # ✅ Human readable duration
    def formatted_duration(self):
        hrs = self.duration // 3600
        mins = (self.duration % 3600) // 60
        secs = self.duration % 60

        if hrs > 0:
            return f"{hrs} hr {mins} min {secs} sec"
        else:
            return f"{mins} min {secs} sec"

    # ✅ Show session timing nicely
    def session_time(self):
        if self.start_time and self.end_time:
            return f"{self.start_time.strftime('%I:%M %p')} → {self.end_time.strftime('%I:%M %p')}"
        return "Not recorded"