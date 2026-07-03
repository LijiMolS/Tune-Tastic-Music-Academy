from django.urls import path
from django.conf import settings 
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('edit_profile/', views.edit_profile, name='edit_profile'),
    path('delete_account/', views.delete_account, name='delete_account'),

    # Free courses
    path('free/piano/', views.piano_free_course, name='piano_free_course'),
    path('free/keyboard/', views.keyboard_free_course, name='keyboard_free_course'),

    # Paid courses
    path('standard/piano/', views.standard_piano_course, name='standard_piano_course'),
    path('standard/keyboard/', views.standard_keyboard_course, name='standard_keyboard_course'),
    path('premium/piano/', views.premium_piano_course, name='premium_piano_course'),
    path('premium/keyboard/', views.premium_keyboard_course, name='premium_keyboard_course'),

    # Payment page
    path('payment/', views.payment_page, name='payment_page'),

    # NAVBAR subscription link → now goes to start_course
    path('subscription/', views.subscription_page_view, name='subscription'),
    path('subscribe/', views.subscribe, name='subscribe'),
    path('choose-course/', views.choose_course_page, name='choose_course'),
    path('contact/', views.contact_message, name='contact_message'),
    path('help_center/', views.help_center, name='help_center'),
    path('terms_of_service/', views.terms_of_service, name='terms_of_service'),
    path('privacy_policy/', views.privacy_policy, name='privacy_policy'),
    path('ear_training_play/', views.ear_training_view, name='ear_training_play'),
    path('save-score/', views.save_score, name='save_score'),
    path('builder-exercise/', views.builder_exercise, name='builder_exercise'),
    path('save-builder-score/', views.save_builder_score, name='save_builder_score'),
    path('rhythm-challenges/', views.rhythm_challenges_view, name='rhythm_challenges'),
    path("save-rhythm-score/", views.save_rhythm_score, name="save_rhythm_score"),
    
    path('piano-fundamentals/', views.piano_fundamentals, name='piano_fundamentals'),
    path('mark-completed/', views.mark_completed, name='mark_completed'),
    path('piano_free/', views.piano_free, name='piano_free'),
    path('simplesongs/', views.simple_songs, name='simplesongs'),
    path('finger-strength/', views.finger_strength, name='finger_strength'),
    path('keyboard-fundamentals/', views.keyboard_fundamentals, name='keyboard_fundamentals'),
    path('keyboard-free/', views.keyboard_free, name='keyboard_free'),
    path('chords-accompaniment/', views.chords_accompaniment, name='chords_accompaniment'),
    path('play-simple-songs/', views.play_simple_songs, name='play_simple_songs'),
    path('advanced-scales/', views.advanced_scales, name='advanced_scales'),
    path('standard/piano/', views.standard_piano, name='standard_piano'),
    path('chords-harmony/', views.chords_harmony, name='chords_harmony'),
    path('performance-skills/', views.performance_skills, name='performance_skills'),
    path('finger-techniques/', views.finger_techniques, name='finger_techniques'),
    path('standard/keyboard/', views.standard_keyboard, name='standard_keyboard'),
    path('chords-accompaniment-standard-keyboard/', views.chords_accompaniment_standard_keyboard, name='chords_accompaniment_standard_keyboard'),
    path('songs-performance/', views.songs_performance, name='songs_performance'),
    path('advancedscales-fingering/', views.advancedscales_fingering, name='advancedscales_fingering'),
    path('premium/piano/', views.premium_piano, name='premium_piano'),
    path('advance-chord-arpeggios/', views.advance_chord_arpeggios, name='advance_chord_arpeggios'),
    path('advanced-songperformance/', views.advanced_songperformance, name='advanced_songperformance'),
    path('advanced_finger_techniques/', views.advanced_finger_techniques, name='advanced_finger_techniques'),
    path('premium/keyboard/', views.premium_keyboard, name='premium_keyboard'),
    path('chords-arpeggios-advanced/', views.chords_arpeggios_advanced, name='chords_arpeggios_advanced'),
    path('songs-performance-advanced/', views.songs_performance_advanced, name='songs_performance_advanced'),
    path('courses/', views.courses, name='courses'),
    path('interactive-exercises/', views.interactive_exercises, name='interactive-exercises'),
    path('progress/', views.progress, name='progress'),
    path('subscription/', views.subscription, name='subscription'),
    path('save-practice/', views.save_practice, name='save_practice'),
    path('progress/', views.progress_view, name='progress'),
    path('join-session/<int:session_id>/', views.join_session, name='join_session'),
    path("live-sessions/", views.live_sessions, name="live-sessions"),
    path("session/<int:session_id>/", views.session_detail, name="session_detail"),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)