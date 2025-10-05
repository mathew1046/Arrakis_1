// Mock AI services that simulate AI-powered features

export interface ScriptBreakdownResult {
  scenes: Array<{
    id: string;
    number: string;
    description: string;
    location: string;
    timeOfDay: 'Day' | 'Night' | 'Dawn' | 'Dusk';
    estimatedDuration: number;
    characters: string[];
    props: string[];
    vfx: boolean;
    status: 'draft';
    notes?: string;
  }>;
  summary: {
    totalScenes: number;
    totalDuration: number;
    vfxScenes: number;
    locations: string[];
    characters: string[];
  };
}

export interface BudgetForecast {
  projectedTotal: number;
  overBudget: number;
  riskFactors: string[];
  recommendations: string[];
  categoryForecasts: Array<{
    category: string;
    projected: number;
    risk: 'low' | 'medium' | 'high';
  }>;
}

export interface TaskAssignmentSuggestion {
  taskId: string;
  suggestedAssignee: {
    id: string;
    name: string;
    role: string;
    confidence: number;
    reasoning: string;
  };
  alternativeAssignees: Array<{
    id: string;
    name: string;
    role: string;
    confidence: number;
    reasoning: string;
  }>;
}

export interface ConflictResolution {
  conflicts: Array<{
    type: 'schedule' | 'resource' | 'budget';
    description: string;
    severity: 'low' | 'medium' | 'high';
    affectedTasks: string[];
    suggestions: string[];
  }>;
  resolutions: Array<{
    conflictId: string;
    solution: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }>;
}

export interface ProductionReport {
  summary: string;
  keyMetrics: {
    tasksCompleted: number;
    budgetUtilization: number;
    scheduleAdherence: number;
    overallProgress: number;
  };
  insights: string[];
  recommendations: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

class AIService {
  private async delay(ms: number = 2000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async breakdownScript(scriptText: string): Promise<ScriptBreakdownResult> {
    await this.delay(3000); // Longer delay for complex AI processing

    // Mock script breakdown based on common film script patterns
    const mockScenes = [
      {
        id: Date.now().toString(),
        number: "1",
        description: "INT. OFFICE BUILDING - DAY. Protagonist enters the lobby, looking determined.",
        location: "Office Building Interior",
        timeOfDay: "Day" as const,
        estimatedDuration: 3,
        characters: ["Protagonist", "Security Guard"],
        props: ["Briefcase", "ID Badge", "Security Desk"],
        vfx: false,
        status: "draft" as const,
        notes: "Simple establishing shot, minimal setup required"
      },
      {
        id: (Date.now() + 1).toString(),
        number: "2", 
        description: "EXT. CITY STREET - NIGHT. High-speed chase through downtown.",
        location: "City Street",
        timeOfDay: "Night" as const,
        estimatedDuration: 8,
        characters: ["Protagonist", "Antagonist"],
        props: ["Cars", "Street lights", "Traffic"],
        vfx: true,
        status: "draft" as const,
        notes: "Complex action sequence requiring VFX for explosions and car stunts"
      },
      {
        id: (Date.now() + 2).toString(),
        number: "3",
        description: "INT. APARTMENT - DAWN. Quiet moment of reflection.",
        location: "Apartment Interior", 
        timeOfDay: "Dawn" as const,
        estimatedDuration: 4,
        characters: ["Protagonist"],
        props: ["Coffee mug", "Newspaper", "Window"],
        vfx: false,
        status: "draft" as const,
        notes: "Character development scene with natural lighting"
      }
    ];

    const allCharacters = [...new Set(mockScenes.flatMap(scene => scene.characters))];
    const allLocations = [...new Set(mockScenes.map(scene => scene.location))];

    return {
      scenes: mockScenes,
      summary: {
        totalScenes: mockScenes.length,
        totalDuration: mockScenes.reduce((sum, scene) => sum + scene.estimatedDuration, 0),
        vfxScenes: mockScenes.filter(scene => scene.vfx).length,
        locations: allLocations,
        characters: allCharacters
      }
    };
  }

  async forecastBudget(currentBudget: any): Promise<BudgetForecast> {
    await this.delay(2000);

    const overBudget = Math.max(0, currentBudget.spent * 1.15 - currentBudget.total);

    return {
      projectedTotal: currentBudget.spent * 1.15,
      overBudget,
      riskFactors: [
        "Equipment rental extending beyond planned dates",
        "Potential overtime costs for crew",
        "Weather delays affecting location shoots",
        "Additional VFX work required for action sequences"
      ],
      recommendations: [
        "Negotiate better rates for extended equipment rental",
        "Implement stricter schedule management to avoid overtime",
        "Consider indoor alternatives for weather-dependent scenes",
        "Review VFX scope to optimize costs"
      ],
      categoryForecasts: [
        { category: "Cast", projected: 820000, risk: "low" },
        { category: "Crew", projected: 580000, risk: "medium" },
        { category: "Equipment", projected: 450000, risk: "high" },
        { category: "Locations", projected: 280000, risk: "low" },
        { category: "Post-Production", projected: 280000, risk: "medium" },
        { category: "Marketing", projected: 150000, risk: "low" }
      ]
    };
  }

  async suggestTaskAssignments(tasks: any[], users: any[]): Promise<TaskAssignmentSuggestion[]> {
    await this.delay(1500);

    // Mock intelligent task assignment based on role and workload
    return tasks.slice(0, 3).map(task => ({
      taskId: task.id,
      suggestedAssignee: {
        id: users[Math.floor(Math.random() * users.length)].id,
        name: users[Math.floor(Math.random() * users.length)].name,
        role: users[Math.floor(Math.random() * users.length)].role,
        confidence: 0.85 + Math.random() * 0.1,
        reasoning: "Best match based on skills, availability, and current workload"
      },
      alternativeAssignees: users.slice(0, 2).map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        confidence: 0.6 + Math.random() * 0.2,
        reasoning: "Alternative option with relevant experience"
      }))
    }));
  }

  async detectConflicts(tasks: any[], schedule: any): Promise<ConflictResolution> {
    await this.delay(1800);

    return {
      conflicts: [
        {
          type: "schedule",
          description: "Overlapping shoot dates for lead actor",
          severity: "high",
          affectedTasks: ["1", "3"],
          suggestions: ["Reschedule Scene 3 to following week", "Use body double for wide shots"]
        },
        {
          type: "resource",
          description: "Camera equipment double-booked",
          severity: "medium", 
          affectedTasks: ["2", "4"],
          suggestions: ["Rent additional camera package", "Adjust shooting order"]
        },
        {
          type: "budget",
          description: "Equipment costs exceeding allocated budget",
          severity: "medium",
          affectedTasks: ["2", "5"],
          suggestions: ["Negotiate extended rental rates", "Consider alternative equipment"]
        }
      ],
      resolutions: [
        {
          conflictId: "1",
          solution: "Reschedule Scene 3 to October 20th",
          impact: "Minimal impact on overall schedule",
          effort: "low"
        },
        {
          conflictId: "2", 
          solution: "Rent backup camera equipment",
          impact: "Additional $5,000 budget requirement",
          effort: "medium"
        }
      ]
    };
  }

  async generateReport(projectData: any): Promise<ProductionReport> {
    await this.delay(2500);

    const completedTasks = projectData.tasks?.filter((t: any) => t.status === 'done').length || 0;
    const totalTasks = projectData.tasks?.length || 1;
    const budgetUtilization = projectData.budget ? (projectData.budget.spent / projectData.budget.total) * 100 : 0;

    return {
      summary: `Production is currently ${Math.round((completedTasks / totalTasks) * 100)}% complete with ${completedTasks} of ${totalTasks} tasks finished. Budget utilization stands at ${Math.round(budgetUtilization)}% with strong performance in most categories. The project is on track for successful completion within the planned timeline.`,
      keyMetrics: {
        tasksCompleted: Math.round((completedTasks / totalTasks) * 100),
        budgetUtilization: Math.round(budgetUtilization),
        scheduleAdherence: 92,
        overallProgress: Math.round(((completedTasks / totalTasks) + (budgetUtilization / 100)) / 2 * 100)
      },
      insights: [
        "VFX tasks are progressing ahead of schedule",
        "Equipment costs are tracking slightly above budget",
        "Crew productivity has increased 15% over the past week",
        "Location shoots have minimal weather-related delays"
      ],
      recommendations: [
        "Consider accelerating post-production timeline",
        "Implement cost controls for equipment rentals",
        "Maintain current crew scheduling practices",
        "Prepare contingency plans for upcoming outdoor scenes"
      ],
      riskAssessment: {
        level: budgetUtilization > 80 ? "medium" : "low",
        factors: [
          "Equipment rental costs trending upward",
          "Tight timeline for VFX completion",
          "Weather dependency for remaining outdoor scenes"
        ]
      }
    };
  }
}

export const aiService = new AIService();
