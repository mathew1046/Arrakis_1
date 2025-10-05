import json
import os
import threading
from typing import Any, Dict, List, Optional
from config import Config

class JSONDataHandler:
    """Thread-safe JSON data handler for file operations"""
    
    def __init__(self, data_dir: str = None):
        self.data_dir = data_dir or Config.DATA_DIR
        self._locks = {}
        self._lock = threading.Lock()
    
    def _get_lock(self, filename: str):
        """Get or create a lock for a specific file"""
        with self._lock:
            if filename not in self._locks:
                self._locks[filename] = threading.Lock()
            return self._locks[filename]
    
    def _get_file_path(self, filename: str) -> str:
        """Get full path for a JSON file"""
        return os.path.join(self.data_dir, filename)
    
    def read_json(self, filename: str, default: Any = None) -> Any:
        """Read JSON data from file with thread safety"""
        file_path = self._get_file_path(filename)
        lock = self._get_lock(filename)
        
        with lock:
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        return json.load(f)
                return default
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error reading {filename}: {e}")
                return default
    
    def write_json(self, filename: str, data: Any) -> bool:
        """Write JSON data to file with atomic operation"""
        file_path = self._get_file_path(filename)
        lock = self._get_lock(filename)
        
        with lock:
            try:
                # Write to temporary file first, then rename (atomic operation)
                temp_path = file_path + '.tmp'
                with open(temp_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                # Atomic rename
                os.replace(temp_path, file_path)
                return True
            except (IOError, OSError) as e:
                print(f"Error writing {filename}: {e}")
                # Clean up temp file if it exists
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                return False
    
    def get_next_id(self, filename: str) -> str:
        """Generate next available ID for a collection"""
        data = self.read_json(filename, [])
        if not isinstance(data, list):
            return "1"
        
        if not data:
            return "1"
        
        # Find the highest numeric ID
        max_id = 0
        for item in data:
            if isinstance(item, dict) and 'id' in item:
                try:
                    item_id = int(item['id'])
                    max_id = max(max_id, item_id)
                except (ValueError, TypeError):
                    continue
        
        return str(max_id + 1)
    
    def find_by_id(self, filename: str, item_id: str) -> Optional[Dict]:
        """Find item by ID in a JSON array"""
        data = self.read_json(filename, [])
        if not isinstance(data, list):
            return None
        
        for item in data:
            if isinstance(item, dict) and item.get('id') == item_id:
                return item
        return None
    
    def update_by_id(self, filename: str, item_id: str, updates: Dict) -> bool:
        """Update item by ID in a JSON array"""
        data = self.read_json(filename, [])
        if not isinstance(data, list):
            return False
        
        for i, item in enumerate(data):
            if isinstance(item, dict) and item.get('id') == item_id:
                data[i] = {**item, **updates}
                return self.write_json(filename, data)
        return False
    
    def delete_by_id(self, filename: str, item_id: str) -> bool:
        """Delete item by ID from a JSON array"""
        data = self.read_json(filename, [])
        if not isinstance(data, list):
            return False
        
        original_length = len(data)
        data = [item for item in data if not (isinstance(item, dict) and item.get('id') == item_id)]
        
        if len(data) < original_length:
            return self.write_json(filename, data)
        return False
    
    def append_item(self, filename: str, item: Dict) -> bool:
        """Append new item to a JSON array"""
        data = self.read_json(filename, [])
        if not isinstance(data, list):
            data = []
        
        data.append(item)
        return self.write_json(filename, data)

# Global instance
json_handler = JSONDataHandler()

def ensure_data_directory():
    """Ensure data directory exists and copy initial data from frontend"""
    if not os.path.exists(Config.DATA_DIR):
        os.makedirs(Config.DATA_DIR)
    
    # Copy initial data from frontend if it exists
    frontend_data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'prodsight', 'src', 'data')
    
    if os.path.exists(frontend_data_dir):
        import shutil
        for filename in ['users.json', 'tasks.json', 'budget.json', 'script.json', 'vfx.json']:
            src_path = os.path.join(frontend_data_dir, filename)
            dst_path = os.path.join(Config.DATA_DIR, filename)
            
            if os.path.exists(src_path) and not os.path.exists(dst_path):
                shutil.copy2(src_path, dst_path)
                print(f"Copied {filename} from frontend to backend")
    
    # Create assets.json if it doesn't exist
    assets_file = os.path.join(Config.DATA_DIR, 'assets.json')
    if not os.path.exists(assets_file):
        json_handler.write_json('assets.json', [])
