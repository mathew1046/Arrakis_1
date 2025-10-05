#!/usr/bin/env python3
"""
Demo script to show the AI optimization in action
"""

import json
import os
from routes.ai_routes import ScheduleOptimizer, load_json_file, save_json_file

def main():
    """Demonstrate the AI optimization"""
    print("🎬 AI Schedule Optimization Demo")
    print("="*50)
    
    try:
        # Load production schedule
        print("📋 Loading production schedule...")
        production_data = load_json_file('production_schedule.json')
        scenes = production_data.get('shooting_schedule', [])
        
        print(f"✅ Loaded {len(scenes)} scenes")
        
        # Show original order
        print("\n📅 ORIGINAL SCHEDULE:")
        for i, scene in enumerate(scenes):
            actors = [actor.get('actor_name') for actor in scene.get('actors', [])]
            actor_list = ', '.join(actors) if actors else 'No actors'
            print(f"  {i+1:2d}. Scene {scene.get('scene_number'):2d}: {scene.get('location'):<30} ({scene.get('time_of_day'):<5}) - {actor_list}")
        
        # Optimize
        print(f"\n🤖 Running AI optimization...")
        optimizer = ScheduleOptimizer()
        optimized_scenes = optimizer.optimize_schedule(scenes)
        
        # Show optimized order
        print(f"\n🎯 OPTIMIZED SCHEDULE:")
        for i, scene in enumerate(optimized_scenes):
            actors = [actor.get('actor_name') for actor in scene.get('actors', [])]
            actor_list = ', '.join(actors) if actors else 'No actors'
            print(f"  {i+1:2d}. Scene {scene.get('scene_number'):2d}: {scene.get('location'):<30} ({scene.get('time_of_day'):<5}) - {actor_list}")
        
        # Create optimized schedule file
        optimized_data = {
            'project_info': production_data.get('project_info', {}),
            'optimization_info': {
                'optimized_at': '2025-10-05T14:20:13+05:30',
                'optimization_method': 'AI-assisted location clustering and time sorting',
                'total_scenes': len(optimized_scenes)
            },
            'optimized_schedule': optimized_scenes,
            'actor_schedule_summary': production_data.get('actor_schedule_summary', {}),
            'location_summary': production_data.get('location_summary', {}),
            'extras_summary': production_data.get('extras_summary', {})
        }
        
        # Save optimized schedule
        save_json_file(optimized_data, 'optimized_schedule.json')
        print(f"\n💾 Optimized schedule saved to 'optimized_schedule.json'")
        
        # Show clustering analysis
        location_clusters = optimizer.cluster_locations(scenes)
        print(f"\n📊 CLUSTERING ANALYSIS:")
        print(f"   Original unique locations: {len(set(scene.get('location') for scene in scenes))}")
        print(f"   Location clusters created: {len(location_clusters)}")
        
        print(f"\n🎯 LOCATION CLUSTERS:")
        for cluster_key, cluster_scenes in location_clusters.items():
            scene_numbers = [s.get('scene_number') for s in cluster_scenes]
            times = list(set(s.get('time_of_day') for s in cluster_scenes))
            print(f"   📍 {cluster_key}")
            print(f"      Scenes: {scene_numbers}")
            print(f"      Times: {', '.join(times)}")
        
        print(f"\n✅ Optimization complete! Benefits:")
        print(f"   🎬 Scenes grouped by location proximity")
        print(f"   ⏰ Within each location, sorted by time of day (DAY → DUSK → NIGHT)")
        print(f"   🚚 Reduced location changes and setup time")
        print(f"   💰 Potential cost savings from efficient scheduling")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
