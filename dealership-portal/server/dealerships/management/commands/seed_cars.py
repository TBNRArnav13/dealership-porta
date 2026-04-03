from django.core.management.base import BaseCommand
from dealerships.models import CarMake, CarModel


class Command(BaseCommand):
    help = 'Seed car makes and models'

    def handle(self, *args, **kwargs):
        data = {
            'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander'],
            'Honda':  ['Civic', 'Accord', 'CR-V', 'Pilot'],
            'Ford':   ['F-150', 'Mustang', 'Explorer', 'Escape'],
            'Chevrolet': ['Silverado', 'Malibu', 'Equinox', 'Tahoe'],
            'BMW':    ['3 Series', '5 Series', 'X3', 'X5'],
            'Audi':   ['A4', 'A6', 'Q5', 'Q7'],
            'Tesla':  ['Model 3', 'Model S', 'Model X', 'Model Y'],
        }
        for make_name, models in data.items():
            make, _ = CarMake.objects.get_or_create(name=make_name, defaults={'description': f'{make_name} vehicles'})
            for model_name in models:
                CarModel.objects.get_or_create(car_make=make, name=model_name, defaults={'type': 'Sedan', 'year': 2023})
        self.stdout.write(self.style.SUCCESS('Car makes and models seeded successfully'))
