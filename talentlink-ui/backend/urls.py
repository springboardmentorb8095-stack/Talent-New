from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def home(request):
    return HttpResponse(
        """
        <html>
        <head>
            <title>TalentLink Backend</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #0f172a;
                    color: #e5e7eb;
                    padding: 40px;
                }
                h1 {
                    color: #38bdf8;
                }
                h2 {
                    color: #22d3ee;
                }
                ul {
                    line-height: 1.8;
                }
                .box {
                    background: #020617;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                code {
                    color: #a5b4fc;
                }
            </style>
        </head>
        <body>

            <h1>🚀 TalentLink Backend Running Successfully</h1>

            <div class="box">
                <h2>🔐 Authentication (JWT)</h2>
                <ul>
                    <li>Login: <code>/api/auth/login/</code></li>
                    <li>Register: <code>/api/auth/register/</code></li>
                    <li>Verify OTP: <code>/api/auth/verify-otp/</code></li>
                    <li>Refresh Token: <code>/api/auth/refresh/</code></li>
                </ul>
            </div>

            <div class="box">
                <h2>👤 Profile Management (CRUD)</h2>
                <ul>
                    <li>Create / View / Update Profile</li>
                    <li>Skills, hourly rate, availability</li>
                    <li>Portfolio support</li>
                    <li>Endpoint: <code>/api/profile/</code></li>
                </ul>
            </div>

            <div class="box">
                <h2>📁 Projects (Client)</h2>
                <ul>
                    <li>Create Project</li>
                    <li>Read Project List</li>
                    <li>Update Project</li>
                    <li>Delete Project</li>
                    <li>Endpoint: <code>/api/projects/</code></li>
                </ul>
            </div>

            <div class="box">
                <h2>🔍 Search & Filters</h2>
                <ul>
                    <li>Filter by Skill</li>
                    <li>Filter by Budget</li>
                    <li>Filter by Duration</li>
                    <li>Example: <code>/api/projects/?skill=react&min_budget=500</code></li>
                </ul>
            </div>

            <div class="box">
                <h2>📨 Proposals</h2>
                <ul>
                    <li>Freelancers submit proposals</li>
                    <li>Clients view proposals per project</li>
                    <li>Clients accept / reject proposals</li>
                    <li>Delete proposal (owner only)</li>
                </ul>
            </div>

            <div class="box">
                <h2>✅ Outcomes Achieved</h2>
                <ul>
                    <li>✔ CRUD for core marketplace objects</li>
                    <li>✔ Search & filter APIs implemented</li>
                    <li>✔ React frontend connected via Axios</li>
                    <li>✔ Clients can post projects</li>
                    <li>✔ Freelancers can submit proposals</li>
                </ul>
            </div>

            <div class="box">
                <h2>🛠 Admin Panel</h2>
                <p><code>/admin/</code></p>
            </div>

        </body>
        </html>
        """
    )

urlpatterns = [
    path("", home),                          # http://127.0.0.1:8000/
    path("admin/", admin.site.urls),         # Admin panel
    path("api/", include("core.urls")),      # App APIs

    # JWT Authentication
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
