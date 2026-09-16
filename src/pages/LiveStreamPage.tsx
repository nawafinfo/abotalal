import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Newspaper, Gamepad2, Film, Trophy, Play, Pause, Volume2, VolumeX, Maximize, Eye, ThumbsUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { useChannels, Channel } from '@/hooks/useChannels';

const categories = [
  { id: 'news', label: 'الأخبار', icon: Newspaper, color: 'from-blue-500 to-blue-700' },
  { id: 'entertainment', label: 'الترفيه', icon: Gamepad2, color: 'from-purple-500 to-purple-700' },
  { id: 'movies', label: 'أفلام ومسلسلات', icon: Film, color: 'from-amber-500 to-orange-700' },
  { id: 'sports', label: 'الرياضة', icon: Trophy, color: 'from-green-500 to-emerald-700' },
];

const VideoPlayer: React.FC<{ channel: Channel | null; onView: (id: string) => void }> = ({ channel, onView }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (channel && videoRef.current) {
      videoRef.current.src = channel.stream_url || '';
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [channel?.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
      if (channel) onView(channel.id);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen?.();
      }
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl group"
      onClick={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={channel?.thumbnail_url || undefined}
        playsInline
      />

      {/* Logo overlay */}
      {channel?.logo_url && (
        <img
          src={channel.logo_url}
          alt="logo"
          className="absolute top-3 right-3 w-10 h-10 object-contain rounded-lg bg-black/40 p-1"
        />
      )}

      {/* LIVE badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/90 px-2.5 py-1 rounded-full">
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-white rounded-full" />
        <span className="text-white text-xs font-bold">LIVE</span>
      </div>

      {/* Play overlay when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={togglePlay}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </motion.div>
        </div>
      )}

      {/* Controls bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {channel && (
                  <div className="flex items-center gap-3 text-white/70 text-xs">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{channel.views_count}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{channel.likes_count}</span>
                  </div>
                )}
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={toggleFullscreen}>
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChannelSection: React.FC<{ category: string; channels: Channel[]; onView: (id: string) => void }> = ({ category, channels, onView }) => {
  const [selected, setSelected] = useState<Channel | null>(channels[0] || null);

  useEffect(() => {
    if (channels.length > 0 && !selected) setSelected(channels[0]);
  }, [channels]);

  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">لا توجد قنوات حالياً في هذا القسم</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <VideoPlayer channel={selected} onView={onView} />

      {/* Channel details */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-4 border">
          <div className="flex items-center gap-3">
            {selected.logo_url && (
              <img src={selected.logo_url} alt={selected.name} className="w-10 h-10 rounded-lg object-contain bg-muted p-1" />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{selected.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{selected.description || 'بث مباشر'}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{selected.views_count}</span>
              <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{selected.likes_count}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Channel list */}
      <div className="space-y-2">
        <h4 className="font-bold text-foreground text-sm">القنوات المتاحة</h4>
        {channels.slice(0, 5).map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(ch)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              selected?.id === ch.id ? 'bg-primary/10 border border-primary/30' : 'bg-card border hover:bg-accent'
            }`}
          >
            {ch.thumbnail_url ? (
              <img src={ch.thumbnail_url} alt={ch.name} className="w-16 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Radio className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{ch.name}</p>
              <p className="text-xs text-muted-foreground truncate">{ch.description || 'بث مباشر'}</p>
            </div>
            {selected?.id === ch.id && (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LiveStreamPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { channels, incrementViews, getByCategory } = useChannels();

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">البث المباشر</h1>
                <p className="text-sm text-muted-foreground">شاهد قنواتك المفضلة مباشرة</p>
              </div>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-2 mb-6"
          >
            {categories.map((cat) => {
              const count = getByCategory(cat.id).length;
              return (
                <div key={cat.id} className={`bg-gradient-to-br ${cat.color} rounded-xl p-3 text-center`}>
                  <cat.icon className="w-5 h-5 text-white mx-auto mb-1" />
                  <p className="text-white text-lg font-bold">{count}</p>
                  <p className="text-white/70 text-[10px]">{cat.label}</p>
                </div>
              );
            })}
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="news" dir="rtl">
            <TabsList className="grid w-full grid-cols-4 mb-4 h-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1 text-xs py-2">
                  <cat.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <ChannelSection
                  category={cat.id}
                  channels={getByCategory(cat.id)}
                  onView={incrementViews}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default LiveStreamPage;
