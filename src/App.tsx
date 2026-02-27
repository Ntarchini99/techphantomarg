import { useState, useEffect } from 'react';
import { Channel } from './types';
import { channels as channelsData } from './data/channels';
import { ChannelList } from './components/ChannelList';
import { VideoPlayer } from './components/VideoPlayer';
import { Loader2 } from 'lucide-react';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setChannels(channelsData);
      } catch (error) {
        console.error('Error loading channels:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, []);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const handleBack = () => {
    setSelectedChannel(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Cargando StreamTV</h2>
          <p className="text-blue-100">Preparando tu contenido favorito...</p>
        </div>
      </div>
    );
  }

  if (selectedChannel) {
    return <VideoPlayer channel={selectedChannel} onBack={handleBack} />;
  }

  return <ChannelList channels={channels} onChannelSelect={handleChannelSelect} />;
}

export default App;
