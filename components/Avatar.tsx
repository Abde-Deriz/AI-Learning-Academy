import React from 'react';
import { AvatarCustomization } from '../types';
import { AVATAR_OPTIONS } from '../constants';

interface AvatarProps {
  avatar: AvatarCustomization;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatar, className = "w-16 h-16" }) => {
  const avatarOption = AVATAR_OPTIONS.find(opt => opt.id === avatar.icon) || AVATAR_OPTIONS[0];
  const AvatarIcon = avatarOption.Icon;

  return (
    <div className={`relative ${className}`}>
      <AvatarIcon className="w-full h-full text-indigo-600" />
    </div>
  );
};

export default Avatar;
