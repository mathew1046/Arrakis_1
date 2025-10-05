from datetime import datetime

def transform_script_data(script):
    """Transforms script data to match frontend expectations."""
    # Rename top-level fields for frontend compatibility
    # Support both snake_case and camelCase field names
    script['totalScenes'] = script.pop('total_scenes', script.get('totalScenes', len(script.get('scenes', []))))
    script['totalEstimatedDuration'] = script.pop('total_runtime_minutes', script.get('totalEstimatedDuration', 0))
    script['vfxScenes'] = script.pop('total_vfx_scenes', script.get('vfxScenes', 0))

    # Ensure essential fields exist
    if 'version' not in script:
        script['version'] = '1.0.0'
    if 'lastModified' not in script:
        script['lastModified'] = datetime.now().strftime('%Y-%m-%d')

    # Process scenes to add IDs and legacy fields
    locations = set()
    characters = set()
    if 'scenes' in script:
        for index, scene in enumerate(script['scenes']):
            # Generate a unique ID for each scene
            scene['id'] = str(scene.get('scene_number', index + 1))

            # Populate legacy fields for backward compatibility
            scene['number'] = str(scene.get('scene_number', ''))
            scene['description'] = scene.get('scene_description', '')
            scene['timeOfDay'] = scene.get('day_night', '')
            scene['estimatedDuration'] = scene.get('estimated_runtime_minutes', 0)
            scene['vfx'] = scene.get('vfx_required', False)
            scene['status'] = scene.get('scene_status', 'Not Shot')

            # Aggregate locations and characters
            if scene.get('location'):
                locations.add(scene['location'])
            if scene.get('characters'):
                characters.update(scene['characters'])

    # Add aggregated data to the top level
    script['locations'] = sorted(list(locations))
    script['characters'] = sorted(list(characters))

    return script
