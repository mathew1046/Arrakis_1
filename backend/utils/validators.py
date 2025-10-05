import re
from datetime import datetime
from typing import Any, Dict, List, Optional

class ValidationError(Exception):
    """Custom validation error"""
    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(self.message)

class Validator:
    """Input validation utilities"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_username(username: str) -> bool:
        """Validate username format (alphanumeric and underscores only)"""
        pattern = r'^[a-zA-Z0-9_]{3,20}$'
        return re.match(pattern, username) is not None
    
    @staticmethod
    def validate_password(password: str) -> bool:
        """Validate password strength (minimum 8 characters)"""
        return len(password) >= 8
    
    @staticmethod
    def validate_date(date_string: str, format: str = '%Y-%m-%d') -> bool:
        """Validate date format"""
        try:
            datetime.strptime(date_string, format)
            return True
        except ValueError:
            return False
    
    @staticmethod
    def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> None:
        """Validate that all required fields are present and not empty"""
        missing_fields = []
        for field in required_fields:
            if field not in data or not data[field]:
                missing_fields.append(field)
        
        if missing_fields:
            raise ValidationError(
                f"Missing required fields: {', '.join(missing_fields)}"
            )
    
    @staticmethod
    def validate_enum(value: Any, valid_values: List[Any], field_name: str) -> None:
        """Validate that value is in the list of valid values"""
        if value not in valid_values:
            raise ValidationError(
                f"{field_name} must be one of: {', '.join(map(str, valid_values))}",
                field_name
            )
    
    @staticmethod
    def validate_numeric_range(value: Any, min_val: float = None, max_val: float = None, field_name: str = None) -> None:
        """Validate numeric value is within range"""
        try:
            num_value = float(value)
        except (ValueError, TypeError):
            raise ValidationError(f"{field_name or 'Value'} must be a number")
        
        if min_val is not None and num_value < min_val:
            raise ValidationError(f"{field_name or 'Value'} must be at least {min_val}")
        
        if max_val is not None and num_value > max_val:
            raise ValidationError(f"{field_name or 'Value'} must be at most {max_val}")
    
    @staticmethod
    def validate_string_length(value: str, min_length: int = None, max_length: int = None, field_name: str = None) -> None:
        """Validate string length"""
        if not isinstance(value, str):
            raise ValidationError(f"{field_name or 'Value'} must be a string")
        
        if min_length is not None and len(value) < min_length:
            raise ValidationError(f"{field_name or 'Value'} must be at least {min_length} characters")
        
        if max_length is not None and len(value) > max_length:
            raise ValidationError(f"{field_name or 'Value'} must be at most {max_length} characters")

def validate_user_data(data: Dict[str, Any]) -> None:
    """Validate user data"""
    Validator.validate_required_fields(data, ['name', 'role', 'email', 'username', 'password'])
    
    if not Validator.validate_email(data['email']):
        raise ValidationError("Invalid email format", "email")
    
    if not Validator.validate_username(data['username']):
        raise ValidationError("Username must be 3-20 characters, alphanumeric and underscores only", "username")
    
    if not Validator.validate_password(data['password']):
        raise ValidationError("Password must be at least 8 characters", "password")
    
    Validator.validate_enum(data['role'], ['Producer', 'Director', 'Crew', 'VFX', 'Distribution Manager', 'Production Manager'], "role")

def validate_task_data(data: Dict[str, Any]) -> None:
    """Validate task data"""
    Validator.validate_required_fields(data, ['title', 'description', 'assigneeId', 'dueDate', 'priority', 'category'])
    
    Validator.validate_string_length(data['title'], 1, 200, "title")
    Validator.validate_string_length(data['description'], 1, 1000, "description")
    
    if 'status' in data:
        Validator.validate_enum(data['status'], ['todo', 'in_progress', 'done'], "status")
    
    Validator.validate_enum(data['priority'], ['low', 'medium', 'high'], "priority")
    
    if not Validator.validate_date(data['dueDate']):
        raise ValidationError("Invalid date format. Use YYYY-MM-DD", "dueDate")
    
    if 'estimatedHours' in data:
        Validator.validate_numeric_range(data['estimatedHours'], 0, 1000, "estimatedHours")

def validate_budget_entry_data(data: Dict[str, Any]) -> None:
    """Validate budget entry data"""
    Validator.validate_required_fields(data, ['amount', 'category', 'description'])
    
    Validator.validate_numeric_range(data['amount'], 0, 10000000, "amount")
    Validator.validate_string_length(data['description'], 1, 500, "description")
    
    if 'date' in data and not Validator.validate_date(data['date']):
        raise ValidationError("Invalid date format. Use YYYY-MM-DD", "date")

def validate_scene_data(data: Dict[str, Any]) -> None:
    """Validate scene data"""
    Validator.validate_required_fields(data, ['number', 'description', 'location', 'timeOfDay', 'estimatedDuration'])
    
    Validator.validate_string_length(data['description'], 1, 2000, "description")
    Validator.validate_string_length(data['location'], 1, 200, "location")
    
    Validator.validate_enum(data['timeOfDay'], ['Day', 'Night', 'Dawn', 'Dusk'], "timeOfDay")
    
    Validator.validate_numeric_range(data['estimatedDuration'], 0, 24, "estimatedDuration")
    
    if 'status' in data:
        Validator.validate_enum(data['status'], ['draft', 'in_review', 'approved'], "status")

def validate_vfx_shot_data(data: Dict[str, Any]) -> None:
    """Validate VFX shot data"""
    Validator.validate_required_fields(data, ['shotName', 'sceneId', 'description', 'assignee', 'dueDate'])
    
    Validator.validate_string_length(data['shotName'], 1, 100, "shotName")
    Validator.validate_string_length(data['description'], 1, 1000, "description")
    
    if not Validator.validate_date(data['dueDate']):
        raise ValidationError("Invalid date format. Use YYYY-MM-DD", "dueDate")
    
    if 'status' in data:
        Validator.validate_enum(data['status'], ['todo', 'in_progress', 'in_review', 'done'], "status")
    
    if 'priority' in data:
        Validator.validate_enum(data['priority'], ['low', 'medium', 'high'], "priority")
    
    if 'complexity' in data:
        Validator.validate_enum(data['complexity'], ['low', 'medium', 'high'], "complexity")
    
    if 'estimatedHours' in data:
        Validator.validate_numeric_range(data['estimatedHours'], 0, 1000, "estimatedHours")
