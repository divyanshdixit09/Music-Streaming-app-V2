class Config(object):
    DEBUG = False
    TESTING = False
    CACHE_TYPE = "RedisCache"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'
    SECRET_KEY = "thisissecter"
    SECURITY_PASSWORD_SALT = "thisissaltt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    CACHE_PORT = 6379
    CACHE_REDIS_HOST = "127.0.0.1"


    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'divyanshdixit0902@gmail.com'
    MAIL_PASSWORD = "ogue kurr cedh ruyv"
    MAIL_DEFAULT_SENDER = 'divyanshdixit0902@gmail.com'