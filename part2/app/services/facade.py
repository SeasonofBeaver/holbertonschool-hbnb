from app.persistence.repository import InMemoryRepository
from app.models.user import User
from app.models.amenity import Amenity

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

#User Facades
    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)
    
    def get_all_user(self):
        return self.user_repo.get_all()

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)
    
    def update_user(self, user_id, user_data):
        user = self.user_repo.get(user_id)
        if not user:
            return None
        for key, value in user_data.items():
            setattr(user, key, value)
        return user

#Amenity Facades
    def create_amenity(self, amenity_data):
        """Create a new amenity."""
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        """Retrieve an amenity by ID."""
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        """Retrieve all amenities."""
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data):
        """Update an amenity by ID."""
        amenity = self.get_amenity(amenity_id)
        if not amenity:
            return None  # If the amenity doesn't exist, return None

        updated_amenity = self.amenity_repo.update(amenity_id, amenity_data)
        return updated_amenity
    
#Place Facade    
    def create_place(self, place_data):
        # Validate price, latitude, and longitude
        price = place_data.get('price')
        latitude = place_data.get('latitude')
        longitude = place_data.get('longitude')
        
        if price < 0:
            raise ValueError("Price must be non-negative.")
        if not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90.")
        if not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180.")

        # Validate that the owner exists
        owner_id = place_data.get('owner_id')
        owner = self.user_repo.get_by_id(owner_id)
        if not owner:
            raise ValueError("Owner not found.")

        # Validate amenities
        amenities = []
        for amenity_id in place_data.get('amenities', []):
            amenity = self.amenity_repo.get_by_id(amenity_id)
            if amenity:
                amenities.append(amenity)

        # Create the place entity
        new_place = self.place_repo.create(place_data)
        new_place.owner = owner
        new_place.amenities = amenities

        return new_place

    def get_place(self, place_id):
        place = self.place_repo.get_by_id(place_id)
        if not place:
            raise ValueError("Place not found.")
        return place

    def get_all_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        place = self.get_place(place_id)  # Fetch place to update
        if not place:
            raise ValueError("Place not found.")

        # Update fields if present in place_data
        for key, value in place_data.items():
            if key in ['price', 'latitude', 'longitude'] and value is not None:
                setattr(place, key, value)

        return self.place_repo.update(place)