// AI Recommendation Service
class RecommendationService {
  /**
   * Generate project recommendations based on user preferences and history
   */
  static generateRecommendations(user, projects, limit = 5) {
    try {
      if (!user.preferences?.category || user.preferences.category.length === 0) {
        return projects.slice(0, limit);
      }

      // Score projects based on user preferences
      const scoredProjects = projects.map(project => {
        let score = 0;

        // Category match (highest priority)
        if (user.preferences.category.includes(project.category)) {
          score += 100;
        }

        // Risk tolerance match
        const projectRisk = this.calculateProjectRisk(project);
        if (projectRisk === user.preferences.riskTolerance) {
          score += 50;
        }

        // Funding progress bonus (projects close to fully funded)
        const fundingPercentage = (project.fundedAmount / project.targetAmount) * 100;
        if (fundingPercentage > 70 && fundingPercentage < 100) {
          score += 30;
        }

        // Interest rate bonus
        if (project.interestRate >= 5) {
          score += 20;
        }

        // Recent projects bonus
        const daysSinceCreation = (Date.now() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation < 7) {
          score += 15;
        }

        return { ...project, score };
      });

      // Sort by score and return top N
      return scoredProjects
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...project }) => project);
    } catch (error) {
      console.error('Recommendation error:', error);
      return projects.slice(0, limit);
    }
  }

  static calculateProjectRisk(project) {
    // Simple risk calculation based on funding progress and project metrics
    const fundingPercentage = (project.fundedAmount / project.targetAmount) * 100;

    if (fundingPercentage > 80) return 'low';
    if (fundingPercentage > 30) return 'medium';
    return 'high';
  }

  /**
   * Personalize recommendations based on user behavior
   */
  static async getPersonalizedRecommendations(userId, userLoans, allProjects) {
    try {
      // Analyze user's past loan categories
      const categoryFrequency = {};
      userLoans.forEach(loan => {
        const category = loan.project?.category;
        categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
      });

      // Get top categories
      const topCategories = Object.entries(categoryFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);

      // Filter and recommend projects
      const recommendedProjects = allProjects.filter(project =>
        topCategories.includes(project.category) &&
        project.status === 'active'
      );

      return recommendedProjects.slice(0, 5);
    } catch (error) {
      console.error('Personalization error:', error);
      return [];
    }
  }
}

module.exports = RecommendationService;
