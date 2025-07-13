'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Wand2, BarChart3, DollarSign, Zap, Shield, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function StackBuilderPage() {
  const [stackName, setStackName] = useState('');
  const [stackDescription, setStackDescription] = useState('');
  const [selectedTech, setSelectedTech] = useState({
    frontend: '',
    backend: '',
    database: '',
    auth: '',
    hosting: '',
    storage: ''
  });

  const router = useRouter();

  // Technology options with metadata
  const technologies = {
    frontend: [
      { name: 'React', cost: 'Free', performance: 'High', learning: 'Medium', compatible: ['Node.js', 'Express.js'] },
      { name: 'Next.js', cost: 'Free', performance: 'Very High', learning: 'Medium', compatible: ['Vercel', 'Supabase'] },
      { name: 'Vue.js', cost: 'Free', performance: 'High', learning: 'Easy', compatible: ['Nuxt.js', 'Laravel'] },
      { name: 'Angular', cost: 'Free', performance: 'High', learning: 'Hard', compatible: ['NestJS', 'Firebase'] },
      { name: 'Svelte', cost: 'Free', performance: 'Very High', learning: 'Easy', compatible: ['SvelteKit'] }
    ],
    backend: [
      { name: 'Node.js', cost: 'Free', performance: 'High', learning: 'Medium', compatible: ['React', 'MongoDB'] },
      { name: 'Django', cost: 'Free', performance: 'High', learning: 'Medium', compatible: ['PostgreSQL', 'Redis'] },
      { name: 'FastAPI', cost: 'Free', performance: 'Very High', learning: 'Easy', compatible: ['PostgreSQL'] },
      { name: 'Express.js', cost: 'Free', performance: 'High', learning: 'Easy', compatible: ['React', 'MongoDB'] },
      { name: 'NestJS', cost: 'Free', performance: 'High', learning: 'Hard', compatible: ['Angular', 'TypeScript'] }
    ],
    database: [
      { name: 'PostgreSQL', cost: 'Free/Paid', performance: 'Very High', learning: 'Medium', compatible: ['Django', 'Next.js'] },
      { name: 'MongoDB', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['Node.js', 'React'] },
      { name: 'Supabase', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['Next.js', 'React'] },
      { name: 'Firebase', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['React', 'Angular'] },
      { name: 'MySQL', cost: 'Free', performance: 'High', learning: 'Medium', compatible: ['Laravel', 'Django'] }
    ],
    auth: [
      { name: 'Firebase Auth', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['React', 'Angular', 'Vue.js'] },
      { name: 'Auth0', cost: 'Free/Paid', performance: 'High', learning: 'Medium', compatible: ['Next.js', 'Express.js'] },
      { name: 'NextAuth.js', cost: 'Free', performance: 'High', learning: 'Easy', compatible: ['Next.js', 'Node.js'] },
      { name: 'Supabase Auth', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['Next.js', 'React'] },
      { name: 'Passport.js', cost: 'Free', performance: 'High', learning: 'Hard', compatible: ['Express.js', 'Node.js'] }
    ],
    hosting: [
      { name: 'Vercel', cost: 'Free/Paid', performance: 'Very High', learning: 'Easy', compatible: ['Next.js', 'React'] },
      { name: 'Netlify', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['React', 'Vue.js'] },
      { name: 'AWS', cost: 'Paid', performance: 'Very High', learning: 'Hard', compatible: ['All'] },
      { name: 'Heroku', cost: 'Free/Paid', performance: 'Medium', learning: 'Easy', compatible: ['Node.js', 'Python'] },
      { name: 'Railway', cost: 'Free/Paid', performance: 'High', learning: 'Medium', compatible: ['Node.js', 'Python', 'Go'] }
    ],
    storage: [
      { name: 'AWS S3', cost: 'Paid', performance: 'Very High', learning: 'Medium', compatible: ['All'] },
      { name: 'Firebase Storage', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['React', 'Angular', 'Vue.js'] },
      { name: 'Supabase Storage', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['Next.js', 'React'] },
      { name: 'Cloudinary', cost: 'Free/Paid', performance: 'High', learning: 'Easy', compatible: ['All'] },
      { name: 'MongoDB Atlas', cost: 'Free/Paid', performance: 'High', learning: 'Medium', compatible: ['Node.js', 'Express.js'] }
    ]
  };

  const handleTechSelect = (category: string, value: string) => {
    setSelectedTech(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSaveStack = () => {
    // Save logic here
    router.push('/stacks');
  };

  const getCompatibilityScore = () => {
    // Simple compatibility check
    const selected = Object.values(selectedTech).filter(Boolean);
    if (selected.length === 0) return 0;

    let score = 0;
    selected.forEach(tech => {
      const techData = Object.values(technologies)
        .flat()
        .find(t => t.name === tech);

      if (techData) {
        const compatibleTechs = techData.compatible;
        const compatibleCount = selected.filter(t =>
          t !== tech && compatibleTechs.includes(t)
        ).length;
        score += compatibleCount / (selected.length - 1);
      }
    });

    return Math.min(Math.round((score / selected.length) * 100), 100);
  };

  const compatibilityScore = getCompatibilityScore();
  const selectedTechCount = Object.values(selectedTech).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Stack Builder</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button
              onClick={handleSaveStack}
              disabled={!stackName || selectedTechCount === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Stack
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stack Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stack Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stack-name">Stack Name</Label>
                  <Input
                    id="stack-name"
                    placeholder="My Awesome Stack"
                    value={stackName}
                    onChange={(e) => setStackName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stack-description">Description</Label>
                  <Textarea
                    id="stack-description"
                    placeholder="Describe your stack..."
                    rows={3}
                    value={stackDescription}
                    onChange={(e) => setStackDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="frontend" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="hosting">Hosting</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>

              {Object.entries(technologies).map(([category, items]) => (
                <TabsContent key={category} value={category} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((tech) => (
                      <Card
                        key={tech.name}
                        className={`cursor-pointer transition-all ${selectedTech[category as keyof typeof selectedTech] === tech.name
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'hover:border-muted-foreground/30'
                          }`}
                        onClick={() => handleTechSelect(category, tech.name)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{tech.name}</h3>
                            <Badge variant="secondary">{tech.cost}</Badge>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-muted-foreground">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            <span className="mr-3">{tech.performance}</span>
                            <Users className="h-4 w-4 mr-1" />
                            <span>{tech.learning}</span>
                          </div>
                          {tech.compatible.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Works well with:</p>
                              <div className="flex flex-wrap gap-1">
                                {tech.compatible.slice(0, 3).map(tech => (
                                  <Badge key={tech} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                                {tech.compatible.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{tech.compatible.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Right Column - Preview & Compatibility */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stack Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTechCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wand2 className="mx-auto h-8 w-8 mb-2" />
                    <p>Start building your stack by selecting technologies</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">{stackName || 'Unnamed Stack'}</h3>
                      {stackDescription && (
                        <p className="text-sm text-muted-foreground">{stackDescription}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      {Object.entries(selectedTech)
                        .filter(([_, value]) => value)
                        .map(([category, tech]) => (
                          <div key={category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground capitalize">{category}</p>
                              <p className="font-medium">{tech}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTechSelect(category, '')}
                            >
                              Change
                            </Button>
                          </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Compatibility</span>
                        <span className="text-sm font-medium">{compatibilityScore}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${compatibilityScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {compatibilityScore > 80 ? 'Excellent compatibility!' :
                          compatibilityScore > 50 ? 'Good compatibility' :
                            'Check compatibility for better matches'}
                      </p>
                    </div>

                    <Button className="w-full mt-4" onClick={handleSaveStack}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Stack
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stack Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <DollarSign className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="font-medium">
                      {selectedTechCount > 0 ? 'Varies' : '—'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <Zap className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Performance</p>
                    <p className="font-medium">
                      {selectedTechCount > 0 ? 'High' : '—'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <Users className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Learning</p>
                    <p className="font-medium">
                      {selectedTechCount > 0 ? 'Medium' : '—'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <Shield className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Security</p>
                    <p className="font-medium">
                      {selectedTechCount > 0 ? 'High' : '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
