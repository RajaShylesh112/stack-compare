"""Test suite for file_utils.sanitize_filename function"""
import pytest
from utils.file_utils import sanitize_filename
from fastapi import HTTPException


class TestSanitizeFilename:
    """Test cases for filename sanitization"""

    def test_path_traversal_rejected(self):
        """Test that path traversal attempts are rejected"""
        with pytest.raises(HTTPException) as exc_info:
            sanitize_filename("../../../etc/passwd")
        assert exc_info.value.status_code == 400
        assert "traversal" in exc_info.value.detail.lower()

    def test_absolute_path_rejected(self):
        """Test that absolute paths are rejected"""
        with pytest.raises(HTTPException) as exc_info:
            sanitize_filename("/etc/passwd")
        assert exc_info.value.status_code == 400
        assert "absolute" in exc_info.value.detail.lower()

    def test_windows_path_rejected(self):
        """Test that Windows drive letters are rejected"""
        with pytest.raises(HTTPException) as exc_info:
            sanitize_filename("C:\\Windows\\System32\\config")
        assert exc_info.value.status_code == 400
        assert "drive" in exc_info.value.detail.lower()

    def test_valid_filename_with_folder(self):
        """Test that valid filenames with folders are accepted and forward slashes preserved"""
        result = sanitize_filename("documents/report-2024.pdf")
        assert result == "documents/report-2024.pdf"
        assert "/" in result  # Forward slash should be preserved for folder structure

    def test_special_characters_sanitized(self):
        """Test that special characters are sanitized to underscores"""
        result = sanitize_filename("my file (copy).txt")
        assert result == "my_file__copy_.txt"
        assert "(" not in result
        assert ")" not in result
        assert " " not in result

    def test_empty_filename_rejected(self):
        """Test that empty filenames are rejected"""
        with pytest.raises(HTTPException) as exc_info:
            sanitize_filename("")
        assert exc_info.value.status_code == 400
        assert "empty" in exc_info.value.detail.lower()

    def test_long_filename_rejected(self):
        """Test that filenames exceeding 255 characters are rejected"""
        with pytest.raises(HTTPException) as exc_info:
            sanitize_filename("a" * 256)
        assert exc_info.value.status_code == 400
        assert "long" in exc_info.value.detail.lower()

    def test_whitespace_stripped(self):
        """Test that leading/trailing whitespace is stripped"""
        result = sanitize_filename("  document.txt  ")
        assert result == "document.txt"

    def test_multiple_slashes_normalized(self):
        """Test that multiple consecutive slashes are normalized"""
        result = sanitize_filename("folder//subfolder///file.txt")
        assert result == "folder/subfolder/file.txt"
        assert "//" not in result

    def test_trailing_slashes_removed(self):
        """Test that trailing slashes are removed but leading slash is rejected"""
        # Leading slash should be rejected as absolute path
        with pytest.raises(HTTPException):
            sanitize_filename("/folder/file.txt/")
        
        # Trailing slash only should be removed
        result = sanitize_filename("folder/file.txt/")
        assert result == "folder/file.txt"
        assert not result.endswith("/")

    def test_only_invalid_chars_rejected(self):
        """Test that filenames with only invalid characters are rejected"""
        with pytest.raises(HTTPException) as exc_info:
            sanitize_filename("!!!@@@###")
        assert exc_info.value.status_code == 400
        assert "invalid" in exc_info.value.detail.lower()

    def test_alphanumeric_preserved(self):
        """Test that alphanumeric characters and allowed symbols are preserved"""
        result = sanitize_filename("file_name-123.txt")
        assert result == "file_name-123.txt"

    def test_nested_folders_allowed(self):
        """Test that nested folder structures are allowed"""
        result = sanitize_filename("folder1/folder2/folder3/file.txt")
        assert result == "folder1/folder2/folder3/file.txt"
        assert result.count("/") == 3
