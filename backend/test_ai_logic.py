#!/usr/bin/env python3
"""
Test the AI scheduling logic directly without Flask server
"""

import json
import os
import sys
from routes.ai_routes import ScheduleOptimizer, load_json_file

def test_location_clustering():
    """Test the location clustering logic"""
    print("🧪 Testing Location Clustering Logic")
    print("="*50)
    
    optimizer = ScheduleOptimizer()
    
    # Test location similarity
    test_cases = [
        ("Radio Station Control Room", "Radio Station Parking Area", "Should be similar"),
        ("Maya's Apartment - Living Room", "Maya's Car", "Should be somewhat similar"),
        ("University Campus Quad", "Government Facility - Briefing Room", "Should be different"),
        ("Desert Highway", "Abandoned Radio Station", "Should be different")
    ]
    
    for loc1, loc2, expected in test_cases:
        similarity = optimizer.calculate_location_similarity(loc1, loc2)
        print(f"📍 {loc1}")
        print(f"📍 {loc2}")
        print(f"   Similarity: {similarity:.3f} - {expected}")
        print()

def test_schedule_optimization():
    """Test the full schedule optimization"""
    print("🚀 Testing Schedule Optimization")
    print("="*50)
    
    try:
        # Load the production schedule
        data_dir = os.path.join(os.path.dirname(__file__), 'data')
        production_file = os.path.join(data_dir, 'production_schedule.json')
        
        with open(production_file, 'r', encoding='utf-8') as f:
            production_data = json.load(f)
        
        scenes = production_data.get('shooting_schedule', [])
        print(f"📋 Loaded {len(scenes)} scenes from production_schedule.json")
        
        # Test optimization
        optimizer = ScheduleOptimizer()
        optimized_scenes = optimizer.optimize_schedule(scenes)
        
        print(f"✅ Optimization completed!")
        print(f"📊 Original order vs Optimized order:")
        print()
        
        print("ORIGINAL ORDER:")
        for i, scene in enumerate(scenes[:5]):  # Show first 5
            print(f"  {i+1}. Scene {scene.get('scene_number')}: {scene.get('location')} ({scene.get('time_of_day')})")
        
        print("\nOPTIMIZED ORDER:")
        for i, scene in enumerate(optimized_scenes[:5]):  # Show first 5
            print(f"  {i+1}. Scene {scene.get('scene_number')}: {scene.get('location')} ({scene.get('time_of_day')})")
        
        # Analyze clustering
        location_clusters = optimizer.cluster_locations(scenes)
        print(f"\n🎯 Location Clustering Results:")
        print(f"   Original locations: {len(set(scene.get('location') for scene in scenes))}")
        print(f"   Location clusters: {len(location_clusters)}")
        
        for cluster_key, cluster_scenes in location_clusters.items():
            scene_numbers = [s.get('scene_number') for s in cluster_scenes]
            print(f"   📍 {cluster_key}: Scenes {scene_numbers}")
        
        return True
        
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
        return False
    except Exception as e:
        print(f"❌ Error during optimization: {e}")
        return False

def test_json_operations():
    """Test JSON file operations"""
    print("📁 Testing JSON File Operations")
    print("="*50)
    
    try:
        # Test loading production_schedule.json
        production_data = load_json_file('production_schedule.json')
        print(f"✅ Successfully loaded production_schedule.json")
        print(f"   Scenes: {len(production_data.get('shooting_schedule', []))}")
        
        # Test loading shooting_schedule.json
        shooting_data = load_json_file('shooting_schedule.json')
        print(f"✅ Successfully loaded shooting_schedule.json")
        print(f"   Scenes: {len(shooting_data.get('shooting_schedule', {}).get('scenes', []))}")
        
        return True
        
    except Exception as e:
        print(f"❌ JSON operation failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🎬 AI Scheduling Logic Tests")
    print("="*60)
    
    tests = [
        ("Location Clustering", test_location_clustering),
        ("JSON Operations", test_json_operations),
        ("Schedule Optimization", test_schedule_optimization)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running: {test_name}")
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append((test_name, False))
        
        print("\n" + "-"*50)
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST RESULTS SUMMARY:")
    print(f"{'='*60}")
    
    passed = 0
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name:<25} {status}")
        if success:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! The AI scheduling logic is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the implementation.")

if __name__ == "__main__":
    main()
