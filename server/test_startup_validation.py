"""Test startup validation for production safety"""
import pytest
import os
import sys
from unittest.mock import patch


class TestStartupValidation:
    """Test cases for startup configuration validation"""
    
    def test_production_mode_rejects_dev_mode(self):
        """Test that production environment rejects dev mode at startup"""
        with patch.dict(os.environ, {"VERCEL_ENV": "production", "ENABLE_DEV_MODE": "true"}):
            # Clear any cached settings
            import importlib
            if 'main' in sys.modules:
                importlib.reload(sys.modules['main'])
            if 'settings' in sys.modules:
                importlib.reload(sys.modules['settings'])
            
            with pytest.raises(RuntimeError, match="Dev mode is enabled in production"):
                import main
    
    def test_missing_allowed_origins_fails(self):
        """Test that missing ALLOWED_ORIGINS causes startup failure"""
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": ""}):
            import importlib
            if 'main' in sys.modules:
                importlib.reload(sys.modules['main'])
            if 'settings' in sys.modules:
                importlib.reload(sys.modules['settings'])
            
            with pytest.raises(RuntimeError, match="ALLOWED_ORIGINS.*required"):
                import main
    
    def test_wildcard_in_production_fails(self):
        """Test that wildcard origins are rejected in production"""
        with patch.dict(os.environ, {
            "VERCEL_ENV": "production",
            "ALLOWED_ORIGINS": "*"
        }):
            import importlib
            if 'main' in sys.modules:
                importlib.reload(sys.modules['main'])
            if 'settings' in sys.modules:
                importlib.reload(sys.modules['settings'])
            
            with pytest.raises(RuntimeError, match="Wildcard origins not allowed in production"):
                import main
    
    def test_wildcard_disables_credentials(self, caplog):
        """Test that wildcard origins disable credentials per CORS spec"""
        with patch.dict(os.environ, {
            "VERCEL_ENV": "development",
            "ALLOWED_ORIGINS": "*"
        }):
            import importlib
            if 'main' in sys.modules:
                importlib.reload(sys.modules['main'])
            if 'settings' in sys.modules:
                importlib.reload(sys.modules['settings'])
            
            import main
            # Check that credentials are disabled
            cors_middleware = None
            for middleware in main.app.user_middleware:
                if middleware.cls.__name__ == 'CORSMiddleware':
                    cors_middleware = middleware
                    break
            
            if cors_middleware:
                assert cors_middleware.options['allow_credentials'] is False
    
    def test_valid_development_config_succeeds(self):
        """Test that valid development configuration starts successfully"""
        with patch.dict(os.environ, {
            "DEBUG": "true",
            "ENABLE_DEV_MODE": "true",
            "ALLOWED_ORIGINS": "http://localhost:3000,http://localhost:3001"
        }):
            import importlib
            if 'main' in sys.modules:
                importlib.reload(sys.modules['main'])
            if 'settings' in sys.modules:
                importlib.reload(sys.modules['settings'])
            
            # Should not raise any errors
            import main
            assert main.app is not None
    
    def test_valid_production_config_succeeds(self):
        """Test that valid production configuration starts successfully"""
        with patch.dict(os.environ, {
            "VERCEL_ENV": "production",
            "DEBUG": "false",
            "ENABLE_DEV_MODE": "false",
            "ALLOWED_ORIGINS": "https://stackcompare.vercel.app"
        }):
            import importlib
            if 'main' in sys.modules:
                importlib.reload(sys.modules['main'])
            if 'settings' in sys.modules:
                importlib.reload(sys.modules['settings'])
            
            # Should not raise any errors
            import main
            assert main.app is not None
            assert main.IS_PRODUCTION is True


if __name__ == "__main__":
    print("Run with: pytest test_startup_validation.py -v")
