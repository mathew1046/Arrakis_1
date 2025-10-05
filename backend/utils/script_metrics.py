"""
Script Metrics Extraction Utility
Extracts and stores script metrics in a separate JSON file for efficient access
"""

import os
import json
from typing import Dict, Any, List
from utils.json_handler import json_handler

class ScriptMetricsExtractor:
    """Handles extraction and storage of script metrics"""
    
    def __init__(self):
        self.metrics_file = 'script-metrics.json'
    
    def extract_metrics_from_script(self, script_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract key metrics from script data
        
        Args:
            script_data: The complete script data dictionary
            
        Returns:
            Dictionary containing extracted metrics
        """
        if not script_data or 'scenes' not in script_data:
            return self._get_empty_metrics()
        
        scenes = script_data.get('scenes', [])
        
        # Extract unique locations
        locations = set()
        characters = set()
        vfx_scenes_count = 0
        total_runtime = 0
        
        for scene in scenes:
            # Extract location
            location = scene.get('location', '')
            if location:
                locations.add(location)
            
            # Extract characters
            scene_characters = scene.get('characters', [])
            if isinstance(scene_characters, list):
                characters.update(scene_characters)
            
            # Count VFX scenes (check both field names for compatibility)
            if scene.get('vfx_required', scene.get('vfx', False)):
                vfx_scenes_count += 1
            
            # Sum runtime (check both field names for compatibility)
            runtime = scene.get('estimated_runtime_minutes', scene.get('estimatedDuration', 0))
            if isinstance(runtime, (int, float)):
                total_runtime += runtime
        
        # Calculate scene status breakdown
        status_breakdown = {}
        for scene in scenes:
            status = scene.get('scene_status', scene.get('status', 'Unknown'))
            status_breakdown[status] = status_breakdown.get(status, 0) + 1
        
        # Calculate approved scenes
        approved_scenes = status_breakdown.get('Approved', 0)
        
        metrics = {
            'totalScenes': len(scenes),
            'totalEstimatedDuration': total_runtime,
            'vfxScenes': vfx_scenes_count,
            'totalLocations': len(locations),
            'locations': sorted(list(locations)),
            'characters': sorted(list(characters)),
            'approvedScenes': approved_scenes,
            'statusBreakdown': status_breakdown,
            'lastUpdated': script_data.get('lastModified', ''),
            'scriptTitle': script_data.get('title', 'Untitled Script'),
            'scriptVersion': script_data.get('version', '1.0.0')
        }
        
        return metrics
    
    def _get_empty_metrics(self) -> Dict[str, Any]:
        """Return empty metrics structure"""
        return {
            'totalScenes': 0,
            'totalEstimatedDuration': 0,
            'vfxScenes': 0,
            'totalLocations': 0,
            'locations': [],
            'characters': [],
            'approvedScenes': 0,
            'statusBreakdown': {},
            'lastUpdated': '',
            'scriptTitle': 'No Script',
            'scriptVersion': '1.0.0'
        }
    
    def update_metrics(self) -> bool:
        """
        Read script.json, extract metrics, and save to script-metrics.json
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # Read current script data
            script_data = json_handler.read_json('script.json', {})
            
            if not script_data:
                print("Warning: No script data found, creating empty metrics")
                metrics = self._get_empty_metrics()
            else:
                # Extract metrics
                metrics = self.extract_metrics_from_script(script_data)
            
            # Save metrics to separate file
            success = json_handler.write_json(self.metrics_file, metrics)
            
            if success:
                print(f"Script metrics updated successfully: {metrics['totalScenes']} scenes, {metrics['vfxScenes']} VFX scenes, {metrics['totalLocations']} locations")
            else:
                print("Failed to save script metrics")
            
            return success
            
        except Exception as e:
            print(f"Error updating script metrics: {str(e)}")
            return False
    
    def get_metrics(self) -> Dict[str, Any]:
        """
        Get current script metrics from script-metrics.json
        
        Returns:
            Dictionary containing script metrics
        """
        try:
            metrics = json_handler.read_json(self.metrics_file, {})
            
            # If metrics file doesn't exist or is empty, generate from script
            if not metrics:
                print("Metrics file not found, generating from script.json")
                if self.update_metrics():
                    metrics = json_handler.read_json(self.metrics_file, {})
                else:
                    metrics = self._get_empty_metrics()
            
            return metrics
            
        except Exception as e:
            print(f"Error reading script metrics: {str(e)}")
            return self._get_empty_metrics()
    
    def validate_metrics_sync(self) -> bool:
        """
        Check if metrics are in sync with script.json
        
        Returns:
            True if metrics are up to date, False if they need updating
        """
        try:
            script_data = json_handler.read_json('script.json', {})
            metrics = json_handler.read_json(self.metrics_file, {})
            
            if not script_data or not metrics:
                return False
            
            # Compare last modified dates
            script_modified = script_data.get('lastModified', '')
            metrics_updated = metrics.get('lastUpdated', '')
            
            # If dates don't match, metrics need updating
            if script_modified != metrics_updated:
                return False
            
            # Quick validation of scene count
            actual_scenes = len(script_data.get('scenes', []))
            metrics_scenes = metrics.get('totalScenes', 0)
            
            return actual_scenes == metrics_scenes
            
        except Exception as e:
            print(f"Error validating metrics sync: {str(e)}")
            return False

# Global instance for easy access
script_metrics = ScriptMetricsExtractor()
