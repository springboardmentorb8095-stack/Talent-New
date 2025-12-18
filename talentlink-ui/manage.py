#!/usr/bin/env python
"""
Django's command-line utility for administrative tasks.
"""

import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as error:
        raise ImportError(
            "Couldn't import Django. Make sure Django is installed and "
            "your virtual environment is activated."
        ) from error

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
