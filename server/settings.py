from pydantic_settings import BaseSettings
from pydantic import SecretStr
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    database_url: SecretStr
    
    # External API Keys
    github_token: SecretStr
    stackoverflow_api_key: SecretStr
    libraries_io_api_key: SecretStr
    openai_api_key: SecretStr
    
    # Backblaze B2
    b2_key_id: SecretStr
    b2_app_key: SecretStr
    b2_bucket: str
    b2_bucket_id: str
    b2_endpoint: str
    
    # Auth
    neon_auth_secret: SecretStr
    internal_api_key: SecretStr
    
    # Application config
    enable_dev_mode: bool = False  # Default to False for production safety
    debug: bool = False
    allowed_origins: str = "*"  # Allow all origins by default (will be validated in main.py)
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def __init__(self, **data):
        super().__init__(**data)
        # Validate internal_api_key is not default/weak
        weak_keys = ["changeme", "test", "dev", "n8n_internal_key_12345"]
        if self.internal_api_key.get_secret_value() in weak_keys:
            import warnings
            warnings.warn("WARNING: Using default/weak internal_api_key. Change it in production!")


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance"""
    return Settings()
