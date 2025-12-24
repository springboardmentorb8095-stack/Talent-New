# Talent-New
python -m venv env
env\Scripts\activate
pip install -r requirements.txt

CREATE DATABASE IF NOT EXISTS talentlink_db;

python manage.py migrate
cd frontend
npm install
npm start
