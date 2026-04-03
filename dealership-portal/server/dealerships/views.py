import json
import logging
from datetime import datetime

import requests
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel

logger = logging.getLogger(__name__)
BACKEND = settings.BACKEND_URL


# ── Helpers ──────────────────────────────────────────────────────────────────

def get_request(endpoint, **kwargs):
    url = f"{BACKEND}{endpoint}"
    try:
        return requests.get(url, params=kwargs)
    except Exception as e:
        logger.error(f"GET {url} failed: {e}")
        return None


def post_request(endpoint, data):
    url = f"{BACKEND}{endpoint}"
    try:
        return requests.post(url, json=data)
    except Exception as e:
        logger.error(f"POST {url} failed: {e}")
        return None


# ── Auth ──────────────────────────────────────────────────────────────────────

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({'userName': username, 'status': 'Authenticated'})
        return JsonResponse({'userName': username, 'status': 'Failed'}, status=401)
    return JsonResponse({'error': 'POST required'}, status=405)


def logout_user(request):
    logout(request)
    return JsonResponse({'userName': ''})


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        email = data.get('email', '')
        if User.objects.filter(username=username).exists():
            return JsonResponse({'userName': username, 'error': 'Already Registered'}, status=400)
        user = User.objects.create_user(
            username=username, password=password,
            first_name=first_name, last_name=last_name, email=email
        )
        login(request, user)
        return JsonResponse({'userName': username, 'status': 'Authenticated'})
    return JsonResponse({'error': 'POST required'}, status=405)


# ── Dealers ───────────────────────────────────────────────────────────────────

def get_dealerships(request, state='All'):
    endpoint = '/fetchDealers' if state == 'All' else f'/fetchDealers/{state}'
    resp = get_request(endpoint)
    if resp and resp.status_code == 200:
        return JsonResponse({'status': 200, 'dealers': resp.json()})
    return JsonResponse({'status': 500, 'message': 'Error fetching dealers'}, status=500)


def get_dealer_details(request, dealer_id):
    resp = get_request(f'/fetchDealer/{dealer_id}')
    if resp and resp.status_code == 200:
        return JsonResponse({'status': 200, 'dealer': resp.json()})
    return JsonResponse({'status': 500, 'message': 'Error fetching dealer'}, status=500)


def get_dealer_reviews(request, dealer_id):
    resp = get_request(f'/fetchReviews/dealer/{dealer_id}')
    if resp and resp.status_code == 200:
        reviews = resp.json()
        for review in reviews:
            sentiment_resp = get_request('/analyze-review', text=review.get('review', ''))
            if sentiment_resp and sentiment_resp.status_code == 200:
                review['sentiment'] = sentiment_resp.json().get('sentiment', 'neutral')
            else:
                review['sentiment'] = 'neutral'
        return JsonResponse({'status': 200, 'reviews': reviews})
    return JsonResponse({'status': 500, 'message': 'Error fetching reviews'}, status=500)


@csrf_exempt
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 403, 'message': 'Unauthorized'}, status=403)
    if request.method == 'POST':
        data = json.loads(request.body)
        data['time'] = datetime.utcnow().isoformat()
        resp = post_request('/insertReview', data)
        if resp and resp.status_code == 200:
            return JsonResponse({'status': 200})
        return JsonResponse({'status': 500, 'message': 'Error posting review'}, status=500)
    return JsonResponse({'error': 'POST required'}, status=405)


# ── Cars ──────────────────────────────────────────────────────────────────────

def get_cars(request):
    makes = list(CarMake.objects.values('id', 'name', 'description'))
    return JsonResponse({'CarMakes': makes})


def get_car_models(request):
    models_qs = CarModel.objects.select_related('car_make').values(
        'id', 'name', 'type', 'year', 'car_make__name'
    )
    return JsonResponse({'CarModels': list(models_qs)})


# ── Sentiment ─────────────────────────────────────────────────────────────────

def analyze_review_sentiment(request):
    text = request.GET.get('text', '')
    resp = get_request('/analyze-review', text=text)
    if resp and resp.status_code == 200:
        return JsonResponse(resp.json())
    return JsonResponse({'sentiment': 'neutral'})


# ── Template Views ────────────────────────────────────────────────────────────

def index(request):
    return render(request, 'index.html')


def about(request):
    team = [
        {'name': 'Sarah Johnson', 'role': 'CEO & Founder', 'email': 'sarah@bestcars.com',
         'description': 'Sarah founded Best Cars in 2010 with a vision to bring transparency to car buying.',
         'image': 'https://randomuser.me/api/portraits/women/44.jpg'},
        {'name': 'Michael Chen', 'role': 'CTO', 'email': 'michael@bestcars.com',
         'description': 'Michael leads our engineering team, building the platform that powers 500+ dealerships.',
         'image': 'https://randomuser.me/api/portraits/men/32.jpg'},
        {'name': 'Emily Rodriguez', 'role': 'Head of Operations', 'email': 'emily@bestcars.com',
         'description': 'Emily ensures every dealership meets our quality and service standards.',
         'image': 'https://randomuser.me/api/portraits/women/68.jpg'},
        {'name': 'David Park', 'role': 'Lead Developer', 'email': 'david@bestcars.com',
         'description': 'David architects our microservices and keeps the platform running smoothly.',
         'image': 'https://randomuser.me/api/portraits/men/75.jpg'},
    ]
    return render(request, 'about.html', {'team': team})


def contact(request):
    return render(request, 'contact.html')


def dealer_detail(request, dealer_id):
    return render(request, 'dealer_detail.html', {'dealer_id': dealer_id})


def add_review_page(request, dealer_id):
    if not request.user.is_authenticated:
        return redirect(f'/?next=/add_review/{dealer_id}/')
    years = list(range(2024, 1999, -1))
    return render(request, 'add_review.html', {'dealer_id': dealer_id, 'years': years})
