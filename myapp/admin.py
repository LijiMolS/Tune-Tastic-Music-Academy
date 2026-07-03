from django.contrib import admin
from django.utils.html import format_html
from .models import Profile, UserSubscription, Course, CourseActivity

# -----------------------------
# Profile Admin
# -----------------------------
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'profile_image_tag')

    def profile_image_tag(self, obj):
        """
        Display profile image in admin.
        Shows default image if user has not uploaded one.
        """
        if obj.profile_pic:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius:50%;" />',
                obj.profile_pic.url
            )
        # Optional: static default image if no upload
        return format_html(
            '<img src="/static/images/default-profile.png" width="50" height="50" style="border-radius:50%;" />'
        )

    profile_image_tag.short_description = 'Profile Picture'

# -----------------------------
# Course Admin
# -----------------------------
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

# -----------------------------
# UserSubscription Admin
# -----------------------------
@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'active')
    list_filter = ('plan', 'active')
    search_fields = ('user__username', 'plan')

# -----------------------------
# CourseActivity Admin
# -----------------------------
@admin.register(CourseActivity)
class CourseActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'date', 'time_spent_minutes')
    list_filter = ('course', 'date')
    search_fields = ('user__username',)

from .models import Subscriber

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'subscribed_at')
    
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at", "is_resolved")
    list_filter = ("is_resolved", "created_at")
    search_fields = ("name", "email", "subject", "message")
    ordering = ("-created_at",)

from .models import EarTrainingProgress

@admin.register(EarTrainingProgress)
class EarTrainingProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_score', 'date_completed')
    list_filter = ('date_completed',)
    search_fields = ('user__username',)

from .models import ChordMelodyProgress

@admin.register(ChordMelodyProgress)
class ChordMelodyProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_score', 'date_completed')
    list_filter = ('date_completed',)
    search_fields = ('user__username',)
    
from .models import RhythmProgress

@admin.register(RhythmProgress)
class RhythmProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_score', 'date_completed')
    list_filter = ('date_completed',)
    search_fields = ('user__username',)

from .models import LiveSession
admin.site.register(LiveSession)

from .models import PracticeSession

@admin.register(PracticeSession)
class PracticeSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_time', 'end_time', 'formatted_duration', 'date')

    def formatted_duration(self, obj):
        mins = obj.duration // 60
        secs = obj.duration % 60
        return f"{mins} min {secs} sec"