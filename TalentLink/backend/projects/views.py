from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView

from .models import Project
from .serializers import ProjectSerializer



class ProjectListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # GET → list all projects
    def get(self, request):
        projects = Project.objects.all().order_by("-created_at")
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
    #  Only CLIENT can create projects
        if not hasattr(request.user, "userprofile") or request.user.userprofile.role != "client":
            return Response(
                {"error": "Only clients can create projects"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(client=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class ProjectFilterView(ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()

        budget_eq = self.request.query_params.get("budget_eq")
        budget_gt = self.request.query_params.get("budget_gt")
        budget_gte = self.request.query_params.get("budget_gte")
        budget_lt = self.request.query_params.get("budget_lt")
        budget_lte = self.request.query_params.get("budget_lte")
        budget_ne = self.request.query_params.get("budget_ne")

        currency = self.request.query_params.get("currency")
        sort_by = self.request.query_params.get("sort")
        order = self.request.query_params.get("order")

        if currency:
            queryset = queryset.filter(currency=currency)

        if budget_eq:
            queryset = queryset.filter(budget=budget_eq)
        if budget_gt:
            queryset = queryset.filter(budget__gt=budget_gt)
        if budget_gte:
            queryset = queryset.filter(budget__gte=budget_gte)
        if budget_lt:
            queryset = queryset.filter(budget__lt=budget_lt)
        if budget_lte:
            queryset = queryset.filter(budget__lte=budget_lte)
        if budget_ne:
            queryset = queryset.exclude(budget=budget_ne)

        if sort_by in ["budget", "duration"]:
            queryset = queryset.order_by(
                f"-{sort_by}" if order == "desc" else sort_by
            )

        return queryset



class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    def put(self, request, pk):
        project = get_object_or_404(Project, pk=pk, client=request.user)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = get_object_or_404(Project, pk=pk, client=request.user)
        project.delete()
        return Response(
            {"message": "Project deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
