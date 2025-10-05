#!/usr/bin/env python3
"""
Test script to verify scene titles are working properly
"""

import json
import os

def check_scene_titles():
    """Check if scene titles exist in shooting_schedule.json"""
    try:
        # Load shooting schedule
        with open('data/shooting_schedule.json', 'r') as f:
            shooting_data = json.load(f)
        
        scenes = shooting_data.get('shooting_schedule', {}).get('scenes', [])
        
        print("🎬 Scene Titles in shooting_schedule.json:")
        print("=" * 50)
        
        for scene in scenes[:5]:  # Show first 5 scenes
            scene_num = scene.get('scene_number', 'Unknown')
            scene_title = scene.get('scene_title', 'NO TITLE')
            location = scene.get('location', 'Unknown Location')
            
            print(f"Scene {scene_num}: {scene_title}")
            print(f"   Location: {location}")
            print()
        
        # Check if all scenes have titles
        scenes_with_titles = sum(1 for scene in scenes if scene.get('scene_title'))
        total_scenes = len(scenes)
        
        print(f"📊 Summary:")
        print(f"   Total scenes: {total_scenes}")
        print(f"   Scenes with titles: {scenes_with_titles}")
        print(f"   Coverage: {scenes_with_titles/total_scenes*100:.1f}%" if total_scenes > 0 else "   Coverage: 0%")
        
        if scenes_with_titles == total_scenes:
            print("✅ All scenes have titles!")
            return True
        else:
            print("⚠️  Some scenes missing titles")
            return False
            
    except Exception as e:
        print(f"❌ Error checking scene titles: {e}")
        return False

def test_gemini_api_simple():
    """Test Gemini API without the sync function"""
    try:
        from utils.gemini_scheduler import GeminiScheduler
        
        # Load shooting schedule data
        with open('data/shooting_schedule.json', 'r') as f:
            shooting_data = json.load(f)
        
        print("\n🤖 Testing Gemini Scheduler...")
        print("=" * 40)
        
        # Initialize Gemini scheduler
        scheduler = GeminiScheduler()
        
        # Generate schedule
        result = scheduler.generate_schedule(shooting_data)
        
        print(f"Status: {result.get('status', 'unknown')}")
        print(f"Message: {result.get('message', 'No message')}")
        
        if 'optimized_schedule' in result:
            schedule = result['optimized_schedule']
            print(f"Total shooting days: {schedule.get('total_shooting_days', 'Unknown')}")
            
            # Check if scene titles are preserved
            daily_schedules = schedule.get('daily_schedules', [])
            print(f"Daily schedules count: {len(daily_schedules)}")
            if daily_schedules:
                first_day = daily_schedules[0]
                scenes = first_day.get('scenes', [])
                print(f"Scenes in first day: {len(scenes)}")
                if scenes:
                    first_scene = scenes[0]
                    print(f"First scene data: {first_scene}")
                    scene_title = first_scene.get('scene_title', 'NO TITLE')
                    print(f"First scene title: {scene_title}")
                    if scene_title != 'NO TITLE':
                        print("✅ Gemini API working with scene titles!")
                        return True
                    else:
                        print("⚠️  Gemini API working but scene titles missing")
                        return False
        
        print("⚠️  Gemini API working but no scene titles found")
        return False
        
    except Exception as e:
        print(f"❌ Gemini API test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Scene Titles Integration")
    print("=" * 60)
    
    # Test 1: Check scene titles in data
    titles_ok = check_scene_titles()
    
    # Test 2: Test Gemini API
    gemini_ok = test_gemini_api_simple()
    
    print("\n🎯 Test Results:")
    print("=" * 30)
    print(f"Scene titles in data: {'✅ PASS' if titles_ok else '❌ FAIL'}")
    print(f"Gemini API working: {'✅ PASS' if gemini_ok else '❌ FAIL'}")
    
    if titles_ok and gemini_ok:
        print("\n🎉 Scene titles are working correctly!")
        print("The 'Generate AI Schedule' button should show proper scene titles.")
    else:
        print("\n🔧 Issues found - scene titles may not display properly.")
