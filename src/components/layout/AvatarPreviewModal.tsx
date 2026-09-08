import { X, Users, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveFileUrl } from '@/lib/url';
import type { ChatConversation } from '@/services/chat';

interface AvatarPreviewModalProps {
  chat: ChatConversation;
  onClose: () => void;
}

export default function AvatarPreviewModal({ chat, onClose }: AvatarPreviewModalProps) {
  const navigate = useNavigate();
  const isGroup = chat.type === 'group';
  const avatarUrl = chat.avatarUrl ? resolveFileUrl(chat.avatarUrl) : undefined;
  const initial = chat.name ? chat.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-[320px] overflow-hidden rounded-2xl bg-card shadow-2xl animate-[scale-in_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close */}
        <div className="absolute right-2 top-2 z-20">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/60 transition-colors"
            aria-label="Close preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        <div className="relative flex aspect-square w-full items-center justify-center bg-muted overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={chat.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent/15">
              {isGroup ? (
                <Users size={80} className="text-accent/60" />
              ) : (
                <span className="text-7xl font-bold text-accent">{initial}</span>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-card px-4 py-3">
          <p className="truncate text-[15px] font-semibold text-foreground">{chat.name}</p>
          <p className="text-xs text-muted-foreground">
            {isGroup ? `${chat.members ?? 0} members · Group` : 'Tap to view profile'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex border-t border-border bg-card">
          <button
            onClick={() => {
              onClose();
              if (isGroup) navigate(`/chat/${chat.id}`);
              else navigate(`/dm/${chat.id}`, { state: { name: chat.name } });
            }}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
          >
            <MessageSquareText size={16} />
            {isGroup ? 'Open chat' : 'Chat'}
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => {
              onClose();
              if (isGroup) navigate(`/chat/${chat.id}`);
              else navigate(`/profile/${chat.userId ?? chat.id}`, { state: { from: '/' } });
              // For DM we can also navigate to profile, for group to chat detail
              if (!isGroup && chat.userId) {
                // fallback navigate to profile if userId exists, else dm
              }
            }}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-foreground hover:bg-accent/10 transition-colors"
          >
            <Users size={16} className="text-muted-foreground" />
            View
          </button>
        </div>
      </div>
    </div>
  );
}
