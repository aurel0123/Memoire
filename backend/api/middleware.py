class CookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Autoriser les cookies cross-origin
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Origin"] = request.headers.get('Origin', '*')
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        
        return response
