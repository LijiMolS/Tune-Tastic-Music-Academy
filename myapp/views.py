from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


from .models import (
    Course,
    UserSubscription,
    CourseActivity,
    Subscriber,
    ContactMessage,
    EarTrainingProgress,
    ChordMelodyProgress,
    RhythmProgress,
    Profile
)

# ---------------- Home Page ----------------
def index(request):
    show_popup = request.session.pop('show_welcome_popup', False)
    return render(request, 'index.html', {'show_popup': show_popup})


# ---------------- REGISTER ----------------
from django.contrib.auth import login, authenticate
from django.conf import settings
from django.core.mail import send_mail
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.models import User


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            messages.error(request, "Passwords do not match")
            return redirect('register')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
            return redirect('register')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered")
            return redirect('register')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1
        )

        # Welcome email
        send_mail(
            "Welcome to Tune Tastic 🎵",
            f"Hi {user.username},  welcome to Tune Tastic! \n\nWe're really excited to have you on board. \n\nThank you for registering with us—your musical journey starts here. \n\nExplore our courses, join live sessions, and start building your skills step by step. \n\nWe're here to support you every note of the way. \n\nHappy learning and enjoy your experience with Tune Tastic!",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        # 🔥 IMPORTANT FIX (AUTO LOGIN SAFE WITH MULTIPLE BACKENDS)
        user = authenticate(username=username, password=password1)
        if user is not None:
            login(request, user)

        request.session['show_welcome_popup'] = True
        messages.success(request, "Account created successfully!")

        return redirect('index')

    return render(request, 'register.html')
# ---------------- LOGIN ----------------
def login_view(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # ✅ LOGIN EMAIL NOTIFICATION
            send_mail(
                "New Login Alert 🔐",
                f"Hi {user.username},\n\nWelcome back to Tune Tastic! 🎶\n\nKeep practicing, keep improving, and enjoy your musical journey with us.\n\n- Team Tune Tastic",
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=True
            )

            request.session['show_welcome_popup'] = True
            messages.success(request, f"Welcome {user.username}!")

            return redirect('index')

        messages.error(request, "Invalid username or password")

    return render(request, 'login.html')


# ---------------- LOGOUT ----------------
def logout_view(request):
    logout(request)
    messages.success(request, "Logged out successfully")
    return redirect('index')


# ---------------- PROFILE ----------------
@login_required
def profile(request):
    return render(request, 'profile.html')


# ---------------- EDIT PROFILE ----------------
@login_required
def edit_profile(request):
    user = request.user
    profile, _ = Profile.objects.get_or_create(user=user)

    if request.method == "POST":

        if request.FILES.get('profile_pic'):
            profile.profile_pic = request.FILES['profile_pic']
            profile.save()

        username = request.POST.get("username").strip()
        email = request.POST.get("email").strip()

        if User.objects.filter(username=username).exclude(pk=user.pk).exists():
            messages.error(request, "Username already taken")
            return redirect("edit_profile")

        if User.objects.filter(email=email).exclude(pk=user.pk).exists():
            messages.error(request, "Email already in use")
            return redirect("edit_profile")

        user.username = username
        user.email = email

        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password1 and password2:
            if password1 == password2:
                user.set_password(password1)
                update_session_auth_hash(request, user)
            else:
                messages.error(request, "Passwords do not match")
                return redirect("edit_profile")

        user.save()
        messages.success(request, "Profile updated")

        return redirect("profile")

    return render(request, "edit_profile.html", {"profile": profile})


# ---------------- DELETE ACCOUNT ----------------
@login_required
def delete_account(request):
    if request.method == "POST":
        request.user.delete()
        messages.success(request, "Account deleted")
        return redirect("index")

    return render(request, "delete_account.html")


# ---------------- COURSES ----------------
def piano_free_course(request):
    return render(request, 'piano-free.html')

def keyboard_free_course(request):
    return render(request, 'keyboard-free.html')

def user_courses(request):
    return render(request, 'courses.html')

# ---------------- COURSE PAGES ----------------

def standard_piano_course(request):
    return render(request, 'standard-piano.html')


def premium_piano_course(request):
    return render(request, 'premium-piano.html')


def standard_keyboard_course(request):
    return render(request, 'standard-keyboard.html')


def premium_keyboard_course(request):
    return render(request, 'premium-keyboard.html')

def help_center(request):
    return render(request, 'help_center.html')

def terms_of_service(request):
    return render(request, 'terms_of_service.html')

def privacy_policy(request):
    return render(request, 'privacy_policy.html')


# ---------------- PAYMENT (FIXED - ONLY ONE VERSION) ----------------
@login_required
def payment_page(request):
    plan = request.GET.get('plan')
    course_name = request.GET.get('course')

    if request.method == "POST":
        course = Course.objects.get(name__iexact=course_name)

        subscription, _ = UserSubscription.objects.get_or_create(
            user=request.user,
            plan=plan.capitalize()
        )

        subscription.courses.add(course)
        subscription.save()

        messages.success(request, "Payment successful 🎉")

        if plan.lower() == 'standard':
            return redirect('standard_piano_course' if course_name.lower() == 'piano'
                            else 'standard_keyboard_course')
        else:
            return redirect('premium_piano_course' if course_name.lower() == 'piano'
                            else 'premium_keyboard_course')

    return render(request, 'payment.html', {
        'plan': plan,
        'course_name': course_name
    })


# ---------------- SUBSCRIPTION ----------------
@login_required
def subscription_page_view(request):
    return render(request, 'subscription.html')


# ---------------- COURSE CHOOSING ----------------
@login_required
def choose_course_page(request):
    subscription = UserSubscription.objects.filter(user=request.user).first()

    if not subscription:
        subscription = UserSubscription.objects.create(user=request.user, plan='Free')

    courses = Course.objects.all()
    return render(request, 'choose_course.html', {
        'courses': courses,
        'subscription': subscription
    })


@login_required
def choose_course(request):
    if request.method == 'POST':
        course = Course.objects.get(id=request.POST.get('course_id'))

        subscription = UserSubscription.objects.filter(user=request.user).first()
        subscription.courses.add(course)

        if subscription.plan.lower() == 'free':
            return redirect('piano_free_course' if course.name.lower() == 'piano'
                            else 'keyboard_free_course')
        else:
            return redirect(f'/payment?plan={subscription.plan}&course={course.name.lower()}')

    return redirect('choose_course')


# ---------------- SUBSCRIBE ----------------
def subscribe(request):
    if request.method == "POST":
        email = request.POST.get("email")

        Subscriber.objects.get_or_create(email=email)

        send_mail(
            "Welcome to Tune Tastic 🎵",
            "Thanks for subscribing! \n\nYou’ll now receive updates about our latest courses, live sessions, and exciting new features directly to your email.\n\nStay tuned — your musical journey is just getting started.\n\nWe’re excited to keep you inspired and informed every step of the way.\n\n- Team Tune Tastic",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=True,
        )

    return redirect(request.META.get('HTTP_REFERER'))


# ---------------- CONTACT (AJAX) ----------------
def contact_message(request):
    if request.method == "POST" and request.headers.get('X-Requested-With') == 'XMLHttpRequest':

        name = request.POST.get("name")
        email = request.POST.get("email")
        subject = request.POST.get("subject", "Contact")
        message = request.POST.get("message")

        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        send_mail(
            "We received your message 🎵",
            f"Hi {name},\n\nThanks for contacting us! We'll get back to you soon.\n\n- Team Tune Tastic",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=True
        )
         # ✅ 2. Send email to ADMIN
        admin_message = f"""
        New Contact Message 📩

        Name: {name}
        Email: {email}
        Subject: {subject}

        Message:
        {message}
            """

        send_mail(
            f"New Contact: {subject}",
            admin_message,
            settings.EMAIL_HOST_USER,
            [settings.ADMIN_EMAIL],  #  ADMIN MAIL HERE
            fail_silently=True
        )


        return JsonResponse({"success": True})

    return JsonResponse({"success": False})

from django.contrib.auth.decorators import login_required

@login_required(login_url='login')  # 👈 redirect if not logged in
def ear_training_view(request):
    return render(request, 'ear_training_play.html')

# ---------------- PROGRESS SAVING ----------------

@csrf_exempt
def save_score(request):
    if request.method == "POST" and request.user.is_authenticated:
        score = int(request.POST.get("score", 0))
        EarTrainingProgress.objects.create(user=request.user, total_score=score)

        return JsonResponse({"status": "success", "score": score})

    return JsonResponse({"status": "error"})


@login_required
def builder_exercise(request):
    return render(request, 'builder-exercise.html')


@csrf_exempt
def save_builder_score(request):
    if request.method == "POST" and request.user.is_authenticated:
        score = int(request.POST.get("score", 0))
        ChordMelodyProgress.objects.create(user=request.user, total_score=score)
        
        return JsonResponse({"status": "success", "score": score})

    return JsonResponse({"status": "error"})


def rhythm_challenges_view(request):
    return render(request, "rhythm_challenges.html")


@csrf_exempt
def save_rhythm_score(request):
    if request.method == "POST" and request.user.is_authenticated:
        score = int(request.POST.get("score", 0))
        RhythmProgress.objects.create(user=request.user, total_score=score)

        return JsonResponse({"status": "success", "score": score})

    return JsonResponse({"status": "error"})


def piano_fundamentals(request):
    return render(request, 'piano_fundamentals.html')

def piano_free(request):
    return render(request, 'piano-free.html')

def simple_songs(request):
    return render(request, 'simplesongs.html')

def finger_strength(request):
    return render(request, 'fingerstrength.html')

def keyboard_fundamentals(request):
    return render(request, 'keyboard_fundamentals.html')

def keyboard_free(request):
    return render(request, 'keyboard-free.html')

def chords_accompaniment(request):
    return render(request, 'chords_accompaniment.html')

def play_simple_songs(request):
    return render(request, 'play_simple_songs.html')

def advanced_scales(request):
    return render(request, 'advanced_scales.html')

def standard_piano(request):
    return render(request, 'standard_piano.html')

def chords_harmony(request):
    return render(request, 'chords_harmony.html')

def performance_skills(request):
    return render(request, 'performance_skills.html')

def finger_techniques(request):
    return render(request, 'finger_techniques.html')

def standard_keyboard(request):
    return render(request, 'standard_keyboard.html')

def chords_accompaniment_standard_keyboard(request):
    return render(request, 'chords_accompaniment_standard_keyboard.html')

def songs_performance(request):
    return render(request, 'songs_performance.html')

def advancedscales_fingering(request):
    return render(request, 'advancedscales_fingering.html')

def premium_piano(request):
    return render(request, 'premium_piano.html')

def advance_chord_arpeggios(request):
    return render(request, 'advance_chord_arpeggios.html')

def advanced_songperformance(request):
    return render(request, 'advanced_songperformance.html')

def advanced_finger_techniques(request):
    return render(request, 'advanced_finger_techniques.html')

def premium_keyboard(request):
    return render(request, 'premium_keyboard.html')

def chords_arpeggios_advanced(request):
    return render(request, 'chords_arpeggios_advanced.html')

def songs_performance_advanced(request):
    return render(request, 'songs_performance_advanced.html')

from django.http import JsonResponse
import json

@login_required
def mark_completed(request):
    if request.method == "POST":
        data = json.loads(request.body)
        lesson = data.get("lesson")

        CourseActivity.objects.create(
            user=request.user,
            course=lesson,
            time_spent_minutes=0
        )

        return JsonResponse({"success": True})

    return JsonResponse({"success": False})

from django.shortcuts import render

def courses(request):
    return render(request, 'courses.html')

@login_required
def interactive_exercises(request):
    return render(request, 'interactive-exercises.html')

def progress(request):
    return render(request, 'progress.html')

def subscription(request):
    return render(request, 'subscription.html')

from django.http import JsonResponse
from .models import Practice
from django.contrib.auth.decorators import login_required
import json

@login_required
def save_practice(request):
    if request.method == "POST":
        data = json.loads(request.body)
        duration = data.get("duration")

        Practice.objects.create(
            user=request.user,
            duration=duration
        )

        return JsonResponse({"status": "success"})
    
from django.shortcuts import render, get_object_or_404, redirect
from .models import LiveSession

# LIST PAGE
def live_sessions(request):
    sessions = LiveSession.objects.all().order_by('start_time')
    return render(request, 'live-sessions.html', {'sessions': sessions})


# DETAIL PAGE
def session_detail(request, session_id):
    session = get_object_or_404(LiveSession, id=session_id)
    return render(request, 'session-detail.html', {'session': session})


# JOIN SESSION
def join_session(request, session_id):
    session = get_object_or_404(LiveSession, id=session_id)

    if session.status == 'live':
        return redirect(session.zoom_link)

    elif session.status == 'upcoming':
        return render(request, 'session-detail.html', {
            'session': session,
            'message': 'Session not started yet'
        })

    else:
        return render(request, 'session-detail.html', {
            'session': session,
            'message': 'Session ended'
        })
    
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

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Sum
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
import json
import datetime

from .models import PracticeSession


# =========================
# 🔥 TIME FORMATTER
# =========================
def format_time(seconds):
    hrs = seconds // 3600
    mins = (seconds % 3600) // 60
    secs = seconds % 60

    if hrs > 0:
        return f"{hrs} hr {mins} min {secs} sec"
    else:
        return f"{mins} min {secs} sec"


# =========================
# 🔥 PROGRESS CALCULATOR
# =========================
def calculate_progress(total_seconds):
    total_hours = total_seconds / 3600
    keyboard_percent = min(int(total_hours * 5), 100)
    piano_percent = min(int(total_hours * 4), 100)
    return keyboard_percent, piano_percent


# =========================
# 🔥 PROGRESS PAGE VIEW
# =========================
@login_required
def progress_view(request):
    user = request.user

    sessions = PracticeSession.objects.filter(user=user)

    total_seconds = sessions.aggregate(
        Sum('duration')
    )['duration__sum'] or 0

    week_ago = timezone.now() - datetime.timedelta(days=7)

    weekly_seconds = sessions.filter(
        start_time__gte=week_ago
    ).aggregate(
        Sum('duration')
    )['duration__sum'] or 0

    formatted_total = format_time(total_seconds)
    formatted_weekly = format_time(weekly_seconds)

    # ✔ USING FUNCTION HERE
    keyboard_percent, piano_percent = calculate_progress(total_seconds)

    return render(request, 'progress.html', {
        'formatted_total': formatted_total,
        'formatted_weekly': formatted_weekly,
        'keyboard_percent': keyboard_percent,
        'piano_percent': piano_percent,
    })


# =========================
# 🔥 SAVE PRACTICE API
# =========================
@csrf_exempt
@login_required
def save_practice(request):
    if request.method == "POST":

        data = json.loads(request.body)

        duration = int(data.get('duration', 0))

        start_time = parse_datetime(data.get('start_time'))
        end_time = parse_datetime(data.get('end_time'))

        # Save session
        PracticeSession.objects.create(
            user=request.user,
            duration=duration,
            start_time=start_time,
            end_time=end_time
        )

        # Get all sessions
        sessions = PracticeSession.objects.filter(user=request.user)

        # Total & weekly time
        total_seconds = sessions.aggregate(Sum('duration'))['duration__sum'] or 0

        weekly_seconds = sessions.filter(
            start_time__gte=timezone.now() - datetime.timedelta(days=7)
        ).aggregate(Sum('duration'))['duration__sum'] or 0

        formatted_total = format_time(total_seconds)
        formatted_weekly = format_time(weekly_seconds)

        # =========================
        # 🎯 PROGRESS CALCULATION
        # =========================
        keyboard_percent, piano_percent = calculate_progress(total_seconds)

        # =========================
        # 🔥 STREAK LOGIC (NEW)
        # =========================
        today = timezone.now().date()

        last_session = sessions.order_by('-start_time').first()

        streak = 1  # default

        if last_session and last_session.start_time:
            last_date = last_session.start_time.date()

            if last_date == today:
                # already practiced today
                streak = getattr(request.user.profile, 'streak', 1)

            elif (today - last_date).days == 1:
                # consecutive day
                streak = getattr(request.user.profile, 'streak', 0) + 1

            else:
                # broken streak
                streak = 1
        else:
            streak = 1

        # Save streak (if you have Profile model)
        if hasattr(request.user, "profile"):
            request.user.profile.streak = streak
            request.user.profile.last_practice_date = today
            request.user.profile.save()

        return JsonResponse({
            'status': 'saved',

            'keyboard_percent': keyboard_percent,
            'piano_percent': piano_percent,

            'total_text': formatted_total,
            'weekly_text': formatted_weekly,

            # 🔥 IMPORTANT: THIS FIXES YOUR "undefined"
            'streak_text': f"{streak} Day(s)"
        })

    return JsonResponse({'status': 'invalid request'}, status=400)