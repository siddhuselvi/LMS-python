class SimpleCache:
    def __init__(self):
        self.cache = {}

    def get(self, key):
        return self.cache.get(key)

    def set(self, key, value, timeout=None):
        self.cache[key] = value

# Instantiate the cache
cache_result = SimpleCache()
