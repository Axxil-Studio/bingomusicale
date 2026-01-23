import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Plus, Trash2, Upload, Download, X, Check, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SONGS_BY_NUMBER } from "@/lib/gameUtils";

export interface Song {
  title: string;
  artist: string;
}

export interface CustomPlaylist {
  [number: number]: Song;
}

interface PlaylistEditorProps {
  playlist: CustomPlaylist;
  onPlaylistChange: (playlist: CustomPlaylist) => void;
  onClose: () => void;
}

export function PlaylistEditor({ playlist, onPlaylistChange, onClose }: PlaylistEditorProps) {
  const [editingNumber, setEditingNumber] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editArtist, setEditArtist] = useState("");

  const getSong = (num: number): Song => {
    return playlist[num] || SONGS_BY_NUMBER[num] || { title: "", artist: "" };
  };

  const isCustom = (num: number): boolean => {
    return num in playlist;
  };

  const handleEditStart = (num: number) => {
    const song = getSong(num);
    setEditTitle(song.title);
    setEditArtist(song.artist);
    setEditingNumber(num);
  };

  const handleEditSave = () => {
    if (editingNumber === null) return;
    
    const newPlaylist = { ...playlist };
    if (editTitle.trim() || editArtist.trim()) {
      newPlaylist[editingNumber] = {
        title: editTitle.trim(),
        artist: editArtist.trim(),
      };
    } else {
      delete newPlaylist[editingNumber];
    }
    
    onPlaylistChange(newPlaylist);
    setEditingNumber(null);
    setEditTitle("");
    setEditArtist("");
  };

  const handleEditCancel = () => {
    setEditingNumber(null);
    setEditTitle("");
    setEditArtist("");
  };

  const handleReset = (num: number) => {
    const newPlaylist = { ...playlist };
    delete newPlaylist[num];
    onPlaylistChange(newPlaylist);
  };

  const handleResetAll = () => {
    onPlaylistChange({});
  };

  const handleExport = () => {
    const fullPlaylist: CustomPlaylist = {};
    for (let i = 1; i <= 90; i++) {
      fullPlaylist[i] = getSong(i);
    }
    const blob = new Blob([JSON.stringify(fullPlaylist, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bingo-playlist.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        
        // Validate and filter only valid entries
        const newPlaylist: CustomPlaylist = {};
        for (const key of Object.keys(imported)) {
          const num = parseInt(key);
          if (num >= 1 && num <= 90 && imported[key]?.title) {
            newPlaylist[num] = {
              title: imported[key].title || "",
              artist: imported[key].artist || "",
            };
          }
        }
        
        onPlaylistChange(newPlaylist);
      } catch (error) {
        console.error("Error importing playlist:", error);
      }
    };
    input.click();
  };

  const customCount = Object.keys(playlist).length;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-border"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground">
                Playlist personalizzato
              </h2>
              <p className="text-sm text-muted-foreground">
                {customCount} canzoni personalizzate
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/10">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-1" />
            Importa JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Esporta
          </Button>
          <div className="flex-1" />
          {customCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleResetAll} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" />
              Ripristina tutto
            </Button>
          )}
        </div>

        {/* Song List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
              const song = getSong(num);
              const isEditing = editingNumber === num;
              const isCustomSong = isCustom(num);

              return (
                <div
                  key={num}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isCustomSong 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  {/* Number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm ${
                    isCustomSong 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {num}
                  </div>

                  {/* Content */}
                  {isEditing ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="Titolo canzone"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Input
                        placeholder="Artista"
                        value={editArtist}
                        onChange={(e) => setEditArtist(e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={handleEditSave}>
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleEditCancel}>
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {song.title || <span className="text-muted-foreground italic">Nessuna canzone</span>}
                        </p>
                        {song.artist && (
                          <p className="text-sm text-muted-foreground truncate">
                            {song.artist}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditStart(num)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {isCustomSong && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleReset(num)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-muted/10">
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
