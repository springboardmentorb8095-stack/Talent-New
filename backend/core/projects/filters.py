import django_filters
from .models import Project

class ProjectFilter(django_filters.FilterSet):
    budget__lte = django_filters.NumberFilter(field_name="budget", lookup_expr="lte")
    budget__gte = django_filters.NumberFilter(field_name="budget", lookup_expr="gte")

    class Meta:
        model = Project
        fields = ["budget__lte", "budget__gte"]
