from app.presentation.views import app
from app.business_logic.services import HbnbService
from app.persistence.repository import InMemoryRepository

""" Initialize repository and service """
repository = InMemoryRepository()
service = HbnbService(repository)

""" Expose the service as a global variable for use in views """
app.service = service