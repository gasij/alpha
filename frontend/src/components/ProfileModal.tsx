import React, { useState } from 'react';
import { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (name: string, phone?: string) => Promise<void>;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await onUpdate(name, phone || undefined);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления профиля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in border border-border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Профиль</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive border border-destructive/30 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-primary/10 text-primary border border-primary/30 rounded-lg p-3 text-sm">
                Профиль успешно обновлен!
              </div>
            )}

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium mb-2 text-foreground">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Email нельзя изменить</p>
            </div>

            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium mb-2 text-foreground">
                Имя <span className="text-primary">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Ваше имя"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="profile-phone" className="block text-sm font-medium mb-2 text-foreground">
                Телефон
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="+7 (999) 123-45-67"
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">
                Дата регистрации: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 active:bg-primary/80 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-all"
              >
                Выйти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

