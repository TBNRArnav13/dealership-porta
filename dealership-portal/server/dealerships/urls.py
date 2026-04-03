from django.urls import path
from . import views

app_name = 'dealerships'

urlpatterns = [
    # Pages
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('dealer/<int:dealer_id>/', views.dealer_detail, name='dealer_detail'),
    path('add_review/<int:dealer_id>/', views.add_review_page, name='add_review_page'),

    # Auth
    path('api/login/', views.login_user, name='login'),
    path('api/logout/', views.logout_user, name='logout'),
    path('api/register/', views.register_user, name='register'),

    # Dealers
    path('api/get_dealers/', views.get_dealerships, name='get_dealers'),
    path('api/get_dealers/<str:state>/', views.get_dealerships, name='get_dealers_by_state'),
    path('api/get_dealer/<int:dealer_id>/', views.get_dealer_details, name='get_dealer'),
    path('api/get_reviews/<int:dealer_id>/', views.get_dealer_reviews, name='get_reviews'),
    path('api/add_review/', views.add_review, name='add_review'),

    # Cars
    path('api/get_cars/', views.get_cars, name='get_cars'),
    path('api/get_car_models/', views.get_car_models, name='get_car_models'),

    # Sentiment
    path('api/analyze_review/', views.analyze_review_sentiment, name='analyze_review'),
]
