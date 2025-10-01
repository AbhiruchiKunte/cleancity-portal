import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Star,
  Crown,
  Target,
  Calendar
} from 'lucide-react';

const Leaderboard = () => {
  // Simulated leaderboard data
  const topContributors = [
    { 
      rank: 1, 
      name: "EcoWarrior Sarah", 
      points: 2850, 
      contributions: 156, 
      badges: ["🌟", "🏆", "🌱"],
      streak: 23,
      initials: "ES"
    },
    { 
      rank: 2, 
      name: "GreenHero Mike", 
      points: 2640, 
      contributions: 142, 
      badges: ["🏅", "🌱", "♻️"],
      streak: 19,
      initials: "GM"
    },
    { 
      rank: 3, 
      name: "CleanCity Anna", 
      points: 2420, 
      contributions: 128, 
      badges: ["🌟", "♻️"],
      streak: 15,
      initials: "CA"
    },
    { 
      rank: 4, 
      name: "RecycleMaster Tom", 
      points: 2180, 
      contributions: 115, 
      badges: ["🏅", "🌱"],
      streak: 12,
      initials: "RT"
    },
    { 
      rank: 5, 
      name: "PlanetSaver Lisa", 
      points: 1950, 
      contributions: 98, 
      badges: ["♻️"],
      streak: 8,
      initials: "PL"
    }
  ];

  const achievements = [
    { name: "First Upload", icon: "🌟", description: "Upload your first waste image" },
    { name: "Streak Master", icon: "🔥", description: "7-day contribution streak" },
    { name: "Top Contributor", icon: "🏆", description: "Top 10 monthly contributor" },
    { name: "Eco Champion", icon: "🌱", description: "100+ contributions" },
    { name: "Cleanup Hero", icon: "♻️", description: "Report 50+ waste items" },
    { name: "Community Leader", icon: "🏅", description: "Help validate reports" }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gradient-eco text-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Community Leaderboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Celebrate our eco-champions who are making a real difference in cleaning up our cities!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top 3 Podium */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>Top Champions</span>
              </CardTitle>
              <CardDescription className="text-center">
                This month's leading environmental heroes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {topContributors.slice(0, 3).map((contributor, index) => (
                  <div key={contributor.rank} className="text-center">
                    <div className={`relative mx-auto w-20 h-20 rounded-full ${getRankBadgeColor(contributor.rank)} flex items-center justify-center mb-4 shadow-eco`}>
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-white text-primary font-bold text-lg">
                          {contributor.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                        {getRankIcon(contributor.rank)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{contributor.name}</h3>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {contributor.points} points
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {contributor.contributions} contributions
                      </p>
                      <div className="flex justify-center space-x-1">
                        {contributor.badges.map((badge, badgeIndex) => (
                          <span key={badgeIndex} className="text-lg">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Rankings */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Full Rankings</span>
              </CardTitle>
              <CardDescription>Complete leaderboard for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.rank} className="flex flex-col sm:flex-row items-center sm:space-x-4 p-4 bg-gradient-eco rounded-lg hover:shadow-clean transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-clean rounded-full shadow-sm">
                      {contributor.rank <= 3 ? (
                        getRankIcon(contributor.rank)
                      ) : (
                        <span className="text-white font-bold">#{contributor.rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {contributor.initials}
                      </AvatarFallback>
                    </Avatar>
                    
<div className="flex-1 min-w-0 text-center sm:text-left mt-3 sm:mt-0">
  <h3 className="font-semibold text-foreground">
    {contributor.name}
  </h3>
  <div className="flex flex-col sm:flex-row justify-center sm:justify-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
    <span>{contributor.contributions} uploads</span>
    <span>🔥 {contributor.streak} day streak</span>
  </div>
</div>
                    
<div className="text-center sm:text-right">
    <div className="font-bold text-lg text-primary">
      {contributor.points}
    </div>
    <div className="text-sm text-muted-foreground">points</div>
  </div>
  
  <div className="flex space-x-1 mt-1">
    {contributor.badges.map((badge, badgeIndex) => (
      <span key={badgeIndex} className="text-lg">{badge}</span>
    ))}
  </div>                    
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Stats */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Your Progress</span>
              </CardTitle>
              <CardDescription>Your current ranking and stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-eco rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">#12</div>
                <p className="text-sm text-muted-foreground">Current Rank</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">1,240</div>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">67</div>
                  <p className="text-xs text-muted-foreground">Uploads</p>
                </div>
              </div>
              
              <Button variant="eco" className="w-full">
                <Target className="mr-2 h-4 w-4" />
                Upload More
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
              <CardDescription>Unlock badges and earn recognition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gradient-eco rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Challenge */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Monthly Challenge</span>
              </CardTitle>
              <CardDescription>Special mission for extra points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-hero rounded-lg text-white">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">Plastic-Free Week</h3>
                <p className="text-sm opacity-90">
                  Upload 10 plastic waste images to earn 2x points!
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">6/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "60%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;