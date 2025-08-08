import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { FuturisticButton } from '@/components/FuturisticButton'
import { useToast } from '@/hooks/use-toast'

interface Profile {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error fetching profile:', error)
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive",
          })
        } else {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, toast])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center particles gradient-mesh">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60 font-orbitron">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background particles gradient-mesh">
      {/* Background effects matching existing design */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
      
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-brand rounded-full opacity-5 blur-3xl floating" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-glow rounded-full opacity-10 blur-2xl floating" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-8 shadow-brand mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-title font-orbitron brand-gradient mb-2">
                Welcome to your Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your FutureTech account and projects
              </p>
            </div>
            <FuturisticButton
              onClick={handleSignOut}
              variant="outline"
              size="sm"
            >
              Sign Out
            </FuturisticButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-6 shadow-brand card-3d">
              <h2 className="text-xl font-orbitron font-bold text-foreground mb-4">Profile</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center">
                    <span className="text-white font-orbitron font-bold text-lg">
                      {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-foreground">
                      {profile?.display_name || 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span className="text-foreground font-orbitron">Standard</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span className="text-foreground font-orbitron">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-6 shadow-brand card-3d">
              <h2 className="text-xl font-orbitron font-bold text-foreground mb-4">Your Projects</h2>
              
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-orbitron font-semibold text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first AR, VR, or Gaming project to get started
                </p>
                <FuturisticButton variant="hero">
                  Start New Project
                </FuturisticButton>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-6 shadow-brand card-3d">
              <h2 className="text-xl font-orbitron font-bold text-foreground mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <div>
                    <p className="text-foreground font-orbitron">Account created</p>
                    <p className="text-sm text-muted-foreground">
                      Welcome to FutureTech! Your journey into immersive technology begins now.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}