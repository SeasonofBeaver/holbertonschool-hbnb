class HbnbService:
    def __init__(self, repository):
        self.repository = repository

    def create_object(self, data):
        """ Business logic for object creation and validationv"""
        if "name" not in data:
            raise ValueError("Missing required field: 'name'")
        return self.repository.add(data)