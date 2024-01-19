from functools import wraps
from flask import abort, current_app


def database_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(current_app, 'database'):
            abort(500, "Database connection not available")
        return f(*args, **kwargs)
    return decorated_function