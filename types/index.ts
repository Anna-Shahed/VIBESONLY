
  track: Track;
  score: number;                 // 0..1
  reasons: string[];
}

export interface LocalPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}


}

  addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void>;
}
