from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import CarMake, CarModel
import json


class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        User.objects.create_user(username='testuser', password='testpass123')

    def test_login_success(self):
        res = self.client.post('/api/login/', json.dumps({'userName': 'testuser', 'password': 'testpass123'}), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['status'], 'Authenticated')

    def test_login_fail(self):
        res = self.client.post('/api/login/', json.dumps({'userName': 'testuser', 'password': 'wrong'}), content_type='application/json')
        self.assertEqual(res.status_code, 401)

    def test_logout(self):
        self.client.login(username='testuser', password='testpass123')
        res = self.client.get('/api/logout/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['userName'], '')

    def test_register(self):
        res = self.client.post('/api/register/', json.dumps({
            'userName': 'newuser', 'password': 'newpass123',
            'firstName': 'New', 'lastName': 'User', 'email': 'new@example.com'
        }), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['status'], 'Authenticated')

    def test_register_duplicate(self):
        self.client.post('/api/register/', json.dumps({'userName': 'dupuser', 'password': 'pass123'}), content_type='application/json')
        res = self.client.post('/api/register/', json.dumps({'userName': 'dupuser', 'password': 'pass123'}), content_type='application/json')
        self.assertEqual(res.status_code, 400)


class CarTests(TestCase):
    def setUp(self):
        make = CarMake.objects.create(name='Toyota', description='Japanese automaker')
        CarModel.objects.create(car_make=make, name='Camry', type='Sedan', year=2023)
        CarModel.objects.create(car_make=make, name='RAV4', type='SUV', year=2023)

    def test_get_cars(self):
        res = self.client.get('/api/get_cars/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('CarMakes', data)
        self.assertEqual(len(data['CarMakes']), 1)

    def test_get_car_models(self):
        res = self.client.get('/api/get_car_models/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('CarModels', data)
        self.assertEqual(len(data['CarModels']), 2)


class PageTests(TestCase):
    def test_index(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)

    def test_about(self):
        res = self.client.get('/about/')
        self.assertEqual(res.status_code, 200)

    def test_contact(self):
        res = self.client.get('/contact/')
        self.assertEqual(res.status_code, 200)
