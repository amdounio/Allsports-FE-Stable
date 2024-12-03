import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Trash2, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { deleteMediaItem, getMediaLibrary } from '../services/api';
import toast from 'react-hot-toast';

interface MatchVisual {
  match: {
    id: string;
    firstTeam: {
      id: number;
      name: string;
      logo: string;
    };
    secondTeam: {
      id: number;
      name: string;
      logo: string;
    };
    startDate: string;
  };
  story: string;
  square: string;
  view: string;
}

interface MediaGroup {
  Date: string;
  data: Array<{
    id: number;
    data: MatchVisual[];
    user_id: number;
  }>;
}

const MediaLibrary = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [mediaGroups, setMediaGroups] = useState<MediaGroup[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMediaLibrary = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getMediaLibrary(user.id);
        console.log('Media Library Response:', response); // Debug log
        setMediaGroups(response || []);
      } catch (error) {
        console.error('Error fetching media:', error);
        toast.error('Failed to load media library');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaLibrary();
  }, [user?.id]);

  const handleDownload = async (url: string, type: string, matchId: string) => {
    if (!url) {
      toast.error('Download URL not available');
      return;
    }

    try {
      setDownloading(`${matchId}-${type}`);
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `match-visual-${type}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      toast.success(`${type} image downloaded successfully`);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (matchId: string, mediathequeId: string) => {
    if (!user?.id || deletingIds.includes(mediathequeId)) return;

    try {
      setDeletingIds(prev => [...prev, mediathequeId]);
      await deleteMediaItem(user.id, matchId, mediathequeId);
      
      // Refresh the media library after deletion
      const response = await getMediaLibrary(user.id);
      setMediaGroups(response || []);
      
      toast.success('Match deleted successfully');
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Failed to delete match');
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== mediathequeId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!mediaGroups.length) {
    return (
      <div className="min-h-screen p-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-light tracking-widest mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            MEDIA LIBRARY
          </h1>
          <p className="text-sm text-zinc-400 tracking-wider">
            Download your match visuals
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <p className="text-lg mb-2">No media saved</p>
          <p className="text-sm">Start by creating visuals for your matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-light tracking-widest mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          MEDIA LIBRARY
        </h1>
        <p className="text-sm text-zinc-400 tracking-wider">
          Download your match visuals
        </p>
      </div>

      <div className="space-y-8">
        {mediaGroups.map((group) => (
          <div key={group.Date} className={`${isDark ? 'bg-zinc-900/30' : 'bg-white'} rounded-[30px] overflow-hidden`}>
            <div className={`px-8 py-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h2 className="text-xl font-light">
                {format(new Date(group.Date), 'EEEE d MMMM', { locale: fr }).toUpperCase()}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {group.data.map((mediaGroup) => (
                mediaGroup.data.map((item) => (
                  <div 
                    key={`${mediaGroup.id}-${item.match.id}`}
                    className={`${isDark ? 'bg-zinc-900/30' : 'bg-white'} rounded-[20px] p-4 shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Match Info */}
                      <div className="flex items-center gap-8">
                        <span className="text-zinc-500 text-sm">
                          {format(new Date(item.match.startDate), 'HH:mm')}
                        </span>
                        <div className="flex items-center gap-6">
                          <img 
                            src={item.match.firstTeam.logo} 
                            alt={item.match.firstTeam.name}
                            className="w-10 h-10 object-contain" 
                          />
                          <span className={`text-base font-light ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            VS
                          </span>
                          <img 
                            src={item.match.secondTeam.logo} 
                            alt={item.match.secondTeam.name}
                            className="w-10 h-10 object-contain" 
                          />
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={isDark ? 'text-white' : 'text-zinc-900'}>
                            {item.match.firstTeam.name}
                          </span>
                          <span className="text-zinc-500">-</span>
                          <span className={isDark ? 'text-white' : 'text-zinc-900'}>
                            {item.match.secondTeam.name}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Story Download Button */}
                        {item.story && (
                          <button
                            onClick={() => handleDownload(item.story, 'story', item.match.id)}
                            disabled={downloading === `${item.match.id}-story`}
                            className={`flex items-center gap-2 px-4 py-2 ${
                              isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'
                            } rounded-full text-sm transition-colors`}
                          >
                            {downloading === `${item.match.id}-story` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            Story
                          </button>
                        )}

                        {/* Square Download Button */}
                        {item.square && (
                          <button
                            onClick={() => handleDownload(item.square, 'square', item.match.id)}
                            disabled={downloading === `${item.match.id}-square`}
                            className={`flex items-center gap-2 px-4 py-2 ${
                              isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'
                            } rounded-full text-sm transition-colors`}
                          >
                            {downloading === `${item.match.id}-square` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            Square
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.match.id, mediaGroup.id.toString())}
                          disabled={deletingIds.includes(mediaGroup.id.toString())}
                          className={`p-2 rounded-full transition-colors ${
                            isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                          }`}
                        >
                          {deletingIds.includes(mediaGroup.id.toString()) ? (
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                          ) : (
                            <Trash2 className="w-5 h-5 text-zinc-500 hover:text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLibrary;